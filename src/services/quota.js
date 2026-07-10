// Quota Service - Generic quota management for documents and PDF tools
// Eliminates duplication between ensureDocumentQuotaBalances and ensurePdfToolQuotaBalances

// env is available via injectRuntimeDependencies / Cloudflare bindings.
// Import kept optional for tooling compatibility.
import { env as _envPlaceholder } from "../env.js";
void _envPlaceholder;

// Types of quotas
export const QuotaType = {
  DOCUMENT: 'document',
  PDF_TOOL: 'pdf_tool'
};

// Configuration for each quota type
const QUOTA_CONFIG = {
  [QuotaType.DOCUMENT]: {
    tableName: 'document_quota_balances',
    typeColumn: 'document_type',
    typesSet: null, // Will be set at runtime
    isLimitedFn: null, // Will be set at runtime
    getDailyLimitFn: null, // Will be set at runtime
    isRenewalEnabledFn: null, // Will be set at runtime
    getUsageCycleFn: null // Will be set at runtime
  },
  [QuotaType.PDF_TOOL]: {
    tableName: 'pdf_tool_quota_balances',
    typeColumn: 'tool_type',
    typesSet: null,
    isLimitedFn: null,
    getDailyLimitFn: null,
    isRenewalEnabledFn: null,
    getUsageCycleFn: null
  }
};

/**
 * Initialize quota configuration with runtime dependencies
 * This should be called once during worker startup
 */
export function initQuotaConfig(dependencies) {
  QUOTA_CONFIG[QuotaType.DOCUMENT] = {
    ...QUOTA_CONFIG[QuotaType.DOCUMENT],
    ...dependencies.document
  };
  QUOTA_CONFIG[QuotaType.PDF_TOOL] = {
    ...QUOTA_CONFIG[QuotaType.PDF_TOOL],
    ...dependencies.pdfTool
  };
}

/**
 * Generic function to ensure quota balances for a user
 * Replaces both ensureDocumentQuotaBalances and ensurePdfToolQuotaBalances
 */
export async function ensureQuotaBalances(db, user, quotaType, usageCycle = null) {
  const config = QUOTA_CONFIG[quotaType];
  if (!config) {
    throw new Error(`Unknown quota type: ${quotaType}`);
  }

  // Check if user is subject to this quota
  if (!config.isLimitedFn(user)) {
    return;
  }

  const dailyLimit = config.getDailyLimitFn(user);
  const renewalEnabled = config.isRenewalEnabledFn(user);
  const now = new Date().toISOString();
  const cycle = usageCycle || config.getUsageCycleFn();
  const currentKey = cycle.date;

  // Fetch existing balances
  const result = await db.prepare(`
    SELECT ${config.typeColumn}, available_count, last_renewal_key
    FROM ${config.tableName}
    WHERE user_id = ?
  `).bind(user.id).all();

  const balances = new Map((result.results || [])
    .filter(row => config.typesSet.has(row[config.typeColumn]))
    .map(row => [row[config.typeColumn], row]));

  // Process each type
  for (const type of config.typesSet) {
    const row = balances.get(type);

    if (!row) {
      // Create new balance
      await db.prepare(`
        INSERT INTO ${config.tableName} (
          user_id, ${config.typeColumn}, available_count, last_renewal_key, updated_at
        )
        VALUES (?, ?, ?, ?, ?)
      `).bind(user.id, type, renewalEnabled ? dailyLimit : 0, currentKey, now).run();
      continue;
    }

    const lastKey = String(row.last_renewal_key || '');

    if (!renewalEnabled) {
      // Just update the renewal key if it changed
      if (lastKey !== currentKey) {
        await db.prepare(`
          UPDATE ${config.tableName}
          SET last_renewal_key = ?, updated_at = ?
          WHERE user_id = ? AND ${config.typeColumn} = ?
        `).bind(currentKey, now, user.id, type).run();
      }
      continue;
    }

    const missingDays = countUsageCyclesBetween(lastKey, currentKey);

    if (missingDays <= 0) {
      continue;
    }

    // Renew quota
    await db.prepare(`
      UPDATE ${config.tableName}
      SET available_count = MAX(0, available_count) + ?,
          last_renewal_key = ?,
          updated_at = ?
      WHERE user_id = ? AND ${config.typeColumn} = ?
    `).bind(missingDays * dailyLimit, currentKey, now, user.id, type).run();
  }
}

/**
 * Generic function to get quota usage summary for a user
 */
export async function getQuotaUsageSummary(db, user, quotaType) {
  const config = QUOTA_CONFIG[quotaType];
  if (!config) {
    throw new Error(`Unknown quota type: ${quotaType}`);
  }

  const cycle = config.getUsageCycleFn();
  const dailyLimit = config.getDailyLimitFn(user);
  const renewalEnabled = config.isRenewalEnabledFn(user);

  // Admin or unlimited users
  if (!config.isLimitedFn(user)) {
    return {
      allowed: true,
      date: cycle.date,
      nextResetAt: cycle.nextResetAt,
      nextRenewalAt: cycle.nextResetAt,
      resetHour: 4, // DAILY_DOCUMENT_RESET_HOUR
      resetMinute: 0, // DAILY_DOCUMENT_RESET_MINUTE
      unlimited: true,
      limit: null,
      dailyAdd: null,
      renewalEnabled: true,
      items: {}
    };
  }

  // Ensure balances are up to date
  await ensureQuotaBalances(db, user, quotaType, cycle);

  const result = await db.prepare(`
    SELECT ${config.typeColumn}, available_count, last_renewal_key
    FROM ${config.tableName}
    WHERE user_id = ?
  `).bind(user.id).all();

  const items = {};

  // Initialize all types with default values
  config.typesSet.forEach(type => {
    items[type] = {
      used: 0,
      remaining: 0,
      available: 0,
      blocked: true,
      lastRenewalKey: cycle.date
    };
  });

  // Populate from database
  (result.results || []).forEach(row => {
    if (!config.typesSet.has(row[config.typeColumn])) return;

    const remaining = Math.max(0, Number(row.available_count || 0));
    items[row[config.typeColumn]] = {
      used: Math.max(0, dailyLimit - Math.min(dailyLimit, remaining)),
      remaining,
      available: remaining,
      blocked: remaining === 0,
      lastRenewalKey: row.last_renewal_key || cycle.date
    };
  });

  return {
    allowed: true,
    date: cycle.date,
    nextResetAt: cycle.nextResetAt,
    nextRenewalAt: cycle.nextResetAt,
    resetHour: 4, // DAILY_DOCUMENT_RESET_HOUR
    resetMinute: 0, // DAILY_DOCUMENT_RESET_MINUTE
    unlimited: false,
    limit: dailyLimit,
    dailyAdd: dailyLimit,
    renewalEnabled,
    items
  };
}

/**
 * Generic function to consume quota for a user
 */
export async function consumeQuota(db, user, quotaType, type) {
  const config = QUOTA_CONFIG[quotaType];
  if (!config) {
    throw new Error(`Unknown quota type: ${quotaType}`);
  }

  if (!config.typesSet.has(type)) {
    throw new Error(`Invalid ${quotaType} type: ${type}`);
  }

  if (!config.isLimitedFn(user)) {
    // Unlimited users just log the action
    return getQuotaUsageSummary(db, user, quotaType);
  }

  await ensureQuotaBalances(db, user, quotaType);

  const now = new Date().toISOString();
  const result = await db.prepare(`
    UPDATE ${config.tableName}
    SET available_count = available_count - 1, updated_at = ?
    WHERE user_id = ?
      AND ${config.typeColumn} = ?
      AND available_count > 0
  `).bind(now, user.id, type).run();

  const changes = Number(result.meta?.changes ?? result.changes ?? 0);

  if (changes === 0) {
    throw new Error(`Sem ${quotaType === QuotaType.DOCUMENT ? 'gerações' : 'usos'} disponíveis para este ${type}. A renovação diária adiciona saldo às 04:00 de Brasília.`);
  }

  return getQuotaUsageSummary(db, user, quotaType);
}

/**
 * Generic function to adjust quota (admin action)
 */
export async function adjustQuotaNow(db, user, quotaType, amount, type = 'all') {
  const config = QUOTA_CONFIG[quotaType];
  if (!config) {
    throw new Error(`Unknown quota type: ${quotaType}`);
  }

  if (user.is_admin) {
    throw new Error(`Administradores não usam saldo diário de ${quotaType === QuotaType.DOCUMENT ? 'documentos' : 'PDF'}.`);
  }

  if (!config.isLimitedFn(user)) {
    throw new Error(`Este plano não possui limite de saldo diário para ${quotaType === QuotaType.DOCUMENT ? 'documentos' : 'ferramentas PDF'}.`);
  }

  const cycle = config.getUsageCycleFn();
  const now = new Date().toISOString();
  await ensureQuotaBalances(db, user, quotaType, cycle);

  const types = type === 'all' ? [...config.typesSet] : [type];

  for (const currentType of types) {
    if (!config.typesSet.has(currentType)) {
      throw new Error(`Invalid ${quotaType} type: ${currentType}`);
    }

    await db.prepare(`
      UPDATE ${config.tableName}
      SET available_count = MAX(0, available_count + ?),
          last_renewal_key = ?,
          updated_at = ?
      WHERE user_id = ? AND ${config.typeColumn} = ?
    `).bind(amount, cycle.date, now, user.id, currentType).run();
  }

  return getQuotaUsageSummary(db, user, quotaType);
}

/**
 * Reset all quotas after plan renewal
 */
export async function resetQuotasAfterRenewal(db, user) {
  if (!user?.id) return;

  const now = new Date().toISOString();
  const cycle = getUsageCycle(); // Will be provided by document config

  // Reset document quotas if applicable
  if (isDocumentUsageLimited(user)) {
    const dailyLimit = getDailyDocumentLimit(user);
    for (const documentType of DOCUMENT_GENERATION_TYPES) {
      await db.prepare(`
        INSERT INTO document_quota_balances (user_id, document_type, available_count, last_renewal_key, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, document_type) DO UPDATE SET
          available_count = excluded.available_count,
          last_renewal_key = excluded.last_renewal_key,
          updated_at = excluded.updated_at
      `).bind(user.id, documentType, dailyLimit, cycle.date, now).run();
    }
  }

  // Reset PDF tool quotas if applicable
  if (userCanUsePdfTools(user) && !user.is_admin) {
    const dailyLimit = getPdfToolDailyLimit(user);
    for (const toolType of PDF_TOOL_TYPES) {
      await db.prepare(`
        INSERT INTO pdf_tool_quota_balances (user_id, tool_type, available_count, last_renewal_key, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, tool_type) DO UPDATE SET
          available_count = excluded.available_count,
          last_renewal_key = excluded.last_renewal_key,
          updated_at = excluded.updated_at
      `).bind(user.id, toolType, dailyLimit, cycle.date, now).run();
    }
  }
}

// These will be injected at runtime
let countUsageCyclesBetween = null;
let getUsageCycle = null;
let isDocumentUsageLimited = null;
let getDailyDocumentLimit = null;
let isDailyQuotaRenewalEnabled = null;
let userCanUsePdfTools = null;
let getPdfToolDailyLimit = null;
let isPdfToolQuotaRenewalEnabled = null;
let DOCUMENT_GENERATION_TYPES = null;
let PDF_TOOL_TYPES = null;

export function injectRuntimeDependencies(deps) {
  countUsageCyclesBetween = deps.countUsageCyclesBetween;
  getUsageCycle = deps.getUsageCycle;
  isDocumentUsageLimited = deps.isDocumentUsageLimited;
  getDailyDocumentLimit = deps.getDailyDocumentLimit;
  isDailyQuotaRenewalEnabled = deps.isDailyQuotaRenewalEnabled;
  userCanUsePdfTools = deps.userCanUsePdfTools;
  getPdfToolDailyLimit = deps.getPdfToolDailyLimit;
  isPdfToolQuotaRenewalEnabled = deps.isPdfToolQuotaRenewalEnabled;
  DOCUMENT_GENERATION_TYPES = deps.DOCUMENT_GENERATION_TYPES;
  PDF_TOOL_TYPES = deps.PDF_TOOL_TYPES;

  // Initialize quota config
  initQuotaConfig({
    document: {
      typesSet: DOCUMENT_GENERATION_TYPES,
      isLimitedFn: isDocumentUsageLimited,
      getDailyLimitFn: getDailyDocumentLimit,
      isRenewalEnabledFn: isDailyQuotaRenewalEnabled,
      getUsageCycleFn: getUsageCycle
    },
    pdfTool: {
      typesSet: PDF_TOOL_TYPES,
      isLimitedFn: user => userCanUsePdfTools(user) && !user.is_admin,
      getDailyLimitFn: getPdfToolDailyLimit,
      isRenewalEnabledFn: isPdfToolQuotaRenewalEnabled,
      getUsageCycleFn: getUsageCycle
    }
  });
}
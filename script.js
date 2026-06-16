const REMOTE_API_BASE_URL = "https://tiny-bread-b482gerador-documentos-rurais-api.kauatech-dev.workers.dev";
const API_BASE_URL = (() => {
    const origin = window.location?.origin || "";
    const hostname = window.location?.hostname || "";
    const usarApiMesmaOrigem = ["localhost", "127.0.0.1", "::1"].includes(hostname)
        || hostname.endsWith(".pages.dev")
        || hostname.endsWith(".workers.dev");

    return /^https?:\/\//i.test(origin) && origin !== "null" && usarApiMesmaOrigem
        ? origin
        : REMOTE_API_BASE_URL;
})();
window.API_BASE_URL = API_BASE_URL;
const STARTUP_SPLASH_DURATION_MS = 4000;
const SESSION_TOKEN_KEY = "documentos_rurais_session_token";
const BILLING_TOKEN_KEY = "documentos_rurais_billing_token";
const APP_VERSION = "4.2.0";
const FAVORITES_STORAGE_KEY = "documentos_rurais_favoritos";
const RECENTS_STORAGE_KEY = "documentos_rurais_recentes";
const GENERATED_COUNT_STORAGE_KEY = "documentos_rurais_documentos_gerados";
const NOTIFICATIONS_READ_STORAGE_KEY = "documentos_rurais_notificacoes_lidas";
const LIQUID_GLASS_THEME_STORAGE_KEY = "documentos_rurais_liquid_glass_theme";
const LIQUID_GLASS_THEME_LAST_STATE_KEY = `${LIQUID_GLASS_THEME_STORAGE_KEY}_last`;
const SYSTEM_THEME_STORAGE_KEY = "documentos_rurais_system_theme";
const PRIVACY_ACCEPTED_STORAGE_KEY = "documentos_rurais_privacidade_aceita";
const PROFILE_PHOTO_MAX_SOURCE_BYTES = 5 * 1024 * 1024;
const PROFILE_PHOTO_MAX_DATA_URL_LENGTH = 420 * 1024;

const authView = document.getElementById("authView");
const startupSplash = document.getElementById("startupSplash");
const documentView = document.getElementById("documentView");
const adminView = document.getElementById("adminView");
const generatorView = document.getElementById("generatorView");
const simpleDocumentView = document.getElementById("simpleDocumentView");
const pdfLocalView = document.getElementById("pdfLocalView");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const backToDocumentsButton = document.getElementById("backToDocumentsButton");
const backToDocumentsFromSimpleButton = document.getElementById("backToDocumentsFromSimpleButton");
const backToDocumentsFromAdminButton = document.getElementById("backToDocumentsFromAdminButton");
const backToDocumentsFromPdfLocalButton = document.getElementById("backToDocumentsFromPdfLocalButton");
const userEmailLabels = Array.from(document.querySelectorAll("[data-user-email]"));
const logoutButtons = Array.from(document.querySelectorAll("[data-logout-button]"));
const documentTypeButtons = Array.from(document.querySelectorAll("[data-document-type]"));
const accessStatusMessage = document.getElementById("accessStatusMessage");
const planActions = document.getElementById("planActions");
const renewPlanButton = document.getElementById("renewPlanButton");
const changePlanButton = document.getElementById("changePlanButton");
const documentUserName = document.getElementById("documentUserName");
const documentGreetingAvatarImage = document.getElementById("documentGreetingAvatarImage");
const documentGreetingAvatarFallback = document.getElementById("documentGreetingAvatarFallback");
const documentPlanCard = document.getElementById("documentPlanCard");
const documentPlanName = document.getElementById("documentPlanName");
const documentPlanRemaining = document.getElementById("documentPlanRemaining");
const documentPlanPercent = document.getElementById("documentPlanPercent");
const documentPlanProgress = document.getElementById("documentPlanProgress");
const documentPlanExpiration = document.getElementById("documentPlanExpiration");
const documentSearch = document.getElementById("documentSearch");
const documentFilterButtons = Array.from(document.querySelectorAll("[data-document-filter]"));
const popularDocumentButtons = Array.from(document.querySelectorAll("[data-document-shortcut]"));
const homeNavigationButtons = Array.from(document.querySelectorAll("[data-home-nav]"));
const documentEmptyState = document.getElementById("documentEmptyState");
const documentCatalogSection = document.getElementById("documentCatalogSection");
const popularDocumentsSection = document.getElementById("popularDocumentsSection");
const homeSections = Array.from(document.querySelectorAll("[data-home-section]"));
const dashboardHomeSection = document.getElementById("dashboardHomeSection");
const favoritesSection = document.getElementById("favoritesSection");
const profileSection = document.getElementById("profileSection");
const recentDocumentsSection = document.getElementById("recentDocumentsSection");
const recentDocumentsList = document.getElementById("recentDocumentsList");
const favoriteDocumentsList = document.getElementById("favoriteDocumentsList");
const appUpdateCard = document.getElementById("appUpdateCard");
const appUpdateVersion = document.getElementById("appUpdateVersion");
const appUpdateMessage = document.getElementById("appUpdateMessage");
const appUpdateDate = document.getElementById("appUpdateDate");
const appUpdateDownloadLink = document.getElementById("appUpdateDownloadLink");
const documentGeneratedCount = document.getElementById("documentGeneratedCount");
const documentFavoriteCount = document.getElementById("documentFavoriteCount");
const documentModelCount = document.getElementById("documentModelCount");
const homeDocumentBalanceCount = document.getElementById("homeDocumentBalanceCount");
const homePdfBalanceCount = document.getElementById("homePdfBalanceCount");
const homeFavoriteCount = document.getElementById("homeFavoriteCount");
const homeRecentCount = document.getElementById("homeRecentCount");
const homeQuickActionButtons = Array.from(document.querySelectorAll("[data-home-action]"));
const homeCategoryShortcutButtons = Array.from(document.querySelectorAll("[data-document-category-shortcut]"));
const profileUserName = document.getElementById("profileUserName");
const profileUserEmail = document.getElementById("profileUserEmail");
const profilePlanName = document.getElementById("profilePlanName");
const profileExpiration = document.getElementById("profileExpiration");
const profileThemePanel = document.getElementById("profileThemePanel");
const toggleLiquidGlassThemeButton = document.getElementById("toggleLiquidGlassThemeButton");
const systemThemeSelect = document.getElementById("systemThemeSelect");
const systemThemeToggleButtons = Array.from(document.querySelectorAll("[data-system-theme-toggle]"));
const profileAvatarOpenButton = document.getElementById("profileAvatarOpenButton");
const profileAvatarModal = document.getElementById("profileAvatarModal");
const profileAvatarCloseButton = document.getElementById("profileAvatarCloseButton");
const profileAvatarImage = document.getElementById("profileAvatarImage");
const profileAvatarFallback = document.getElementById("profileAvatarFallback");
const profileAvatarPreviewImage = document.getElementById("profileAvatarPreviewImage");
const profileAvatarPreviewFallback = document.getElementById("profileAvatarPreviewFallback");
const profileAvatarFile = document.getElementById("profileAvatarFile");
const profileAvatarChangeButton = document.getElementById("profileAvatarChangeButton");
const profileAvatarRemoveButton = document.getElementById("profileAvatarRemoveButton");
const profileAvatarMessage = document.getElementById("profileAvatarMessage");
const notificationButton = document.getElementById("notificationButton");
const notificationBadge = document.getElementById("notificationBadge");
const notificationPopover = document.getElementById("notificationPopover");
const updatesModal = document.getElementById("updatesModal");
const openUpdatesHistoryButton = document.getElementById("openUpdatesHistoryButton");
const closeUpdatesHistoryButton = document.getElementById("closeUpdatesHistoryButton");
const paymentModal = document.getElementById("paymentModal");
const paymentCloseButton = document.getElementById("paymentCloseButton");
const paymentTitle = document.getElementById("paymentTitle");
const paymentDescription = document.getElementById("paymentDescription");
const paymentPlanOptions = document.getElementById("paymentPlanOptions");
const paymentConfirmBox = document.getElementById("paymentConfirmBox");
const paymentConfirmText = document.getElementById("paymentConfirmText");
const paymentShowQrButton = document.getElementById("paymentShowQrButton");
const paymentCancelButton = document.getElementById("paymentCancelButton");
const paymentQrBox = document.getElementById("paymentQrBox");
const paymentQrPlaceholder = document.getElementById("paymentQrPlaceholder");
const paymentPlanSummary = document.getElementById("paymentPlanSummary");
const paymentPixCode = document.getElementById("paymentPixCode");
const paymentCopyPixButton = document.getElementById("paymentCopyPixButton");
const paymentMercadoPagoLink = document.getElementById("paymentMercadoPagoLink");
const paymentBrickStatus = document.getElementById("paymentBrickStatus");
const paymentBrickContainer = document.getElementById("paymentBrickContainer");
const paymentProofForm = document.getElementById("paymentProofForm");
const paymentProofFile = document.getElementById("paymentProofFile");
const paymentProofNote = document.getElementById("paymentProofNote");
const paymentProofMessage = document.getElementById("paymentProofMessage");
const paymentProofSubmitButton = document.getElementById("paymentProofSubmitButton");
const accessBlockedModal = document.getElementById("accessBlockedModal");
const accessBlockedDescription = document.getElementById("accessBlockedDescription");
const blockedRenewButton = document.getElementById("blockedRenewButton");
const blockedChangePlanButton = document.getElementById("blockedChangePlanButton");
const blockedSupportButton = document.getElementById("blockedSupportButton");
const renewalWarningModal = document.getElementById("renewalWarningModal");
const renewalWarningText = document.getElementById("renewalWarningText");
const renewalWarningRenewButton = document.getElementById("renewalWarningRenewButton");
const renewalWarningCloseButton = document.getElementById("renewalWarningCloseButton");
const supportChatButton = document.getElementById("supportChatButton");
const supportChatModal = document.getElementById("supportChatModal");
const supportChatCloseButton = document.getElementById("supportChatCloseButton");
const supportChatMessages = document.getElementById("supportChatMessages");
const supportChatForm = document.getElementById("supportChatForm");
const pdfPreviewModal = document.getElementById("pdfPreviewModal");
const pdfPreviewCloseButton = document.getElementById("pdfPreviewCloseButton");
const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
const pdfCanvas = document.getElementById("pdfCanvas");
const pdfPreviewLoading = document.getElementById("pdfPreviewLoading");
const pdfProgress = document.getElementById("pdfProgress");
const pdfProgressBar = document.getElementById("pdfProgressBar");
const pdfProgressText = document.getElementById("pdfProgressText");
const pdfLoadingMessage = document.getElementById("pdfLoadingMessage");
const pdfPrintButton = document.getElementById("pdfPrintButton");
const pdfDownloadButton = document.getElementById("pdfDownloadButton");
const pdfCloseButton = document.getElementById("pdfCloseButton");
const printPdfButton = document.getElementById("printPdfButton");
const simplePrintPdfButton = document.getElementById("simplePrintPdfButton");
const supportGuestFields = document.getElementById("supportGuestFields");
const supportGuestName = document.getElementById("supportGuestName");
const supportGuestEmail = document.getElementById("supportGuestEmail");
const supportMessage = document.getElementById("supportMessage");
const supportAttachment = document.getElementById("supportAttachment");
const supportChatMessage = document.getElementById("supportChatMessage");
const supportChatSubmitButton = document.getElementById("supportChatSubmitButton");
const pdfLocalCard = document.getElementById("pdfLocalCard");
const pdfLocalCardStatus = document.getElementById("pdfLocalCardStatus");
const pdfLocalLock = document.getElementById("pdfLocalLock");
const pdfLocalUpgradeButton = document.getElementById("pdfLocalUpgradeButton");
const pdfLocalWorkspace = document.getElementById("pdfLocalWorkspace");
const pdfLocalToolButtons = Array.from(document.querySelectorAll("[data-pdf-local-operation]"));
const pdfLocalCategoryButtons = Array.from(document.querySelectorAll("[data-pdf-local-category]"));
const pdfLocalStartUploadButtons = Array.from(document.querySelectorAll("[data-pdf-local-start-upload]"));
const pdfLocalForm = document.getElementById("pdfLocalForm");
const pdfLocalFileLabel = document.getElementById("pdfLocalFileLabel");
const pdfLocalFiles = document.getElementById("pdfLocalFiles");
const pdfLocalUploadDropzone = pdfLocalFiles?.closest(".pdf-upload-dropzone");
const pdfLocalPreview = document.getElementById("pdfLocalPreview");
const pdfLocalPreviewInfo = document.getElementById("pdfLocalPreviewInfo");
const pdfLocalPreviewOpen = document.getElementById("pdfLocalPreviewOpen");
const pdfLocalPreviewFrame = document.getElementById("pdfLocalPreviewFrame");
const pdfLocalPagesField = document.getElementById("pdfLocalPagesField");
const pdfLocalPagesLabel = document.getElementById("pdfLocalPagesLabel");
const pdfLocalPages = document.getElementById("pdfLocalPages");
const pdfLocalPagesHelp = document.getElementById("pdfLocalPagesHelp");
const pdfLocalRotationField = document.getElementById("pdfLocalRotationField");
const pdfLocalRotation = document.getElementById("pdfLocalRotation");
const pdfLocalCompressionField = document.getElementById("pdfLocalCompressionField");
const pdfLocalCompressionLevel = document.getElementById("pdfLocalCompressionLevel");
const pdfLocalOcrLanguageField = document.getElementById("pdfLocalOcrLanguageField");
const pdfLocalOcrLanguage = document.getElementById("pdfLocalOcrLanguage");
const pdfLocalMessage = document.getElementById("pdfLocalMessage");
const pdfLocalSubmitButton = document.getElementById("pdfLocalSubmitButton");
const pdfLocalToolsHome = document.getElementById("pdfLocalToolsHome");
const pdfLocalOperationPanel = document.getElementById("pdfLocalOperationPanel");
const pdfLocalBackToToolsButton = document.getElementById("pdfLocalBackToToolsButton");
const pdfLocalOperationTitle = document.getElementById("pdfLocalOperationTitle");
const pdfLocalOperationDescription = document.getElementById("pdfLocalOperationDescription");
const pdfLocalOperationIcon = document.getElementById("pdfLocalOperationIcon");
const pdfLocalOperationKicker = document.getElementById("pdfLocalOperationKicker");
const adminAccessCard = document.getElementById("adminAccessCard");
const adminAccessForm = document.getElementById("adminAccessForm");
const adminEditingUid = document.getElementById("adminEditingUid");
const adminFormTitle = adminAccessForm?.querySelector(".section-title");
const adminUserName = document.getElementById("adminUserName");
const adminUserEmail = document.getElementById("adminUserEmail");
const adminUserPassword = document.getElementById("adminUserPassword");
const adminUserPlan = document.getElementById("adminUserPlan");
const adminUserStatus = document.getElementById("adminUserStatus");
const adminUserDailyDocumentLimit = document.getElementById("adminUserDailyDocumentLimit");
const adminUserDailyQuotaRenewal = document.getElementById("adminUserDailyQuotaRenewal");
const adminUserQuotaDocument = document.getElementById("adminUserQuotaDocument");
const adminUserQuotaAddAmount = document.getElementById("adminUserQuotaAddAmount");
const adminAddQuotaNowButton = document.getElementById("adminAddQuotaNowButton");
const adminSubtractQuotaNowButton = document.getElementById("adminSubtractQuotaNowButton");
const adminUserPdfTools = document.getElementById("adminUserPdfTools");
const adminUserPdfToolDailyLimit = document.getElementById("adminUserPdfToolDailyLimit");
const adminUserPdfToolQuotaRenewal = document.getElementById("adminUserPdfToolQuotaRenewal");
const adminUserPdfToolOperation = document.getElementById("adminUserPdfToolOperation");
const adminUserPdfToolQuotaAmount = document.getElementById("adminUserPdfToolQuotaAmount");
const adminAddPdfToolQuotaButton = document.getElementById("adminAddPdfToolQuotaButton");
const adminSubtractPdfToolQuotaButton = document.getElementById("adminSubtractPdfToolQuotaButton");
const adminUserVerified = document.getElementById("adminUserVerified");
const adminUserLiquidGlass = document.getElementById("adminUserLiquidGlass");
const adminAllowAllDocuments = document.getElementById("adminAllowAllDocuments");
const adminDocumentAccessList = document.getElementById("adminDocumentAccessList");
const adminUserQuotaSummary = document.getElementById("adminUserQuotaSummary");
const adminUserPdfToolQuotaSummary = document.getElementById("adminUserPdfToolQuotaSummary");
const adminUserNotes = document.getElementById("adminUserNotes");
const adminAccessMessage = document.getElementById("adminAccessMessage");
const adminAccessButton = document.getElementById("adminAccessButton");
const adminUsersList = document.getElementById("adminUsersList");
const refreshAdminUsersButton = document.getElementById("refreshAdminUsersButton");
const adminApkUploadForm = document.getElementById("adminApkUploadForm");
const adminApkVersion = document.getElementById("adminApkVersion");
const adminApkDownloadUrl = document.getElementById("adminApkDownloadUrl");
const adminApkNotes = document.getElementById("adminApkNotes");
const adminApkCurrent = document.getElementById("adminApkCurrent");
const adminApkMessage = document.getElementById("adminApkMessage");
const adminApkButton = document.getElementById("adminApkButton");
const adminApkDeleteButton = document.getElementById("adminApkDeleteButton");
const adminHistoryPanel = document.getElementById("adminHistoryPanel");
const adminHistoryTitle = document.getElementById("adminHistoryTitle");
const adminHistoryList = document.getElementById("adminHistoryList");
const adminHistoryCloseButton = document.getElementById("adminHistoryCloseButton");
const refreshAdminSupportButton = document.getElementById("refreshAdminSupportButton");
const adminSupportList = document.getElementById("adminSupportList");
const simpleDocumentTitle = document.getElementById("simpleDocumentTitle");
const simpleDocumentDescription = document.getElementById("simpleDocumentDescription");
const simpleDocumentForm = document.getElementById("simpleDocumentForm");
const simpleDocumentFields = document.getElementById("simpleDocumentFields");
const simpleDocumentMessage = document.getElementById("simpleDocumentMessage");
const simpleDocumentButton = document.getElementById("simpleDocumentButton");
let simpleDocumentClearButton = document.getElementById("simpleDocumentClearButton");
const privacyModal = document.getElementById("privacyModal");
const privacyAcceptButton = document.getElementById("privacyAcceptButton");
const form = document.getElementById("contractForm");
const button = document.getElementById("generateButton");
let clearContractFormButton = document.getElementById("clearContractFormButton");
const message = document.getElementById("message");
const conjugeSection = document.getElementById("conjugeSection");
const conjugeFields = Array.from(document.querySelectorAll("[data-conjuge-field]"));
const conjugeRadios = Array.from(document.querySelectorAll('input[name="possui_conjuge"]'));
const obitoSection = document.getElementById("obitoSection");
const obitoFields = Array.from(document.querySelectorAll("[data-obito-field]"));
const obitoRadios = Array.from(document.querySelectorAll('input[name="possui_obito"]'));

let documentoSimplesAtual = null;
let usuarioAtual = null;
let usuarioAtualEhAdmin = false;
let adminUsersCache = {};
let pagamentoPlanoSelecionado = "";
let pagamentoModoAtual = "";
let pagamentoAtualId = "";
let paymentBrickController = null;
let mercadoPagoInstance = null;
let billingUser = null;
let accessExpirationTimer = null;
let accessCheckInterval = null;
let dailyUsageRefreshTimer = null;
let pdfLocalOperation = "merge";
let pdfLocalPreviewUrl = "";
let pdfLocalSelectedFiles = [];
let pdfToolUsage = {
    allowed: false,
    unlimited: false,
    tools: {},
};
let documentCategoryFilter = "all";
let documentoSimplesTipoAtual = "";
let documentUsage = {
    unlimited: true,
    limit: null,
    documents: {},
};
const wizardStates = new WeakMap();

const MONTH_OPTIONS = [
    ["janeiro", "Janeiro"],
    ["fevereiro", "Fevereiro"],
    ["março", "Março"],
    ["abril", "Abril"],
    ["maio", "Maio"],
    ["junho", "Junho"],
    ["julho", "Julho"],
    ["agosto", "Agosto"],
    ["setembro", "Setembro"],
    ["outubro", "Outubro"],
    ["novembro", "Novembro"],
    ["dezembro", "Dezembro"],
];

const MARITAL_STATUS_OPTIONS = [
    ["Solteiro (a)", "Solteiro (a)"],
    ["Casado (a)", "Casado (a)"],
    ["Divorciado (a)", "Divorciado (a)"],
    ["Viúvo (a)", "Viúvo (a)"],
    ["União estável", "União estável"],
];

const PDF_LOCAL_MAX_FILE_BYTES = 50 * 1024 * 1024;
const PDF_LOCAL_MAX_FILES = 30;
const PDF_LOCAL_COMPRESSION_LEVELS = {
    balanced: {
        label: "equilibrada",
        scale: 1.5,
        maxDimension: 1800,
        jpegQuality: 0.74,
    },
    strong: {
        label: "forte",
        scale: 1.15,
        maxDimension: 1450,
        jpegQuality: 0.56,
    },
    maximum: {
        label: "máxima",
        scale: 0.9,
        maxDimension: 1100,
        jpegQuality: 0.42,
    },
};
const PDF_LOCAL_OCR_RENDER_LEVELS = {
    balanced: {
        scale: 1.65,
        maxDimension: 1900,
    },
    strong: {
        scale: 1.45,
        maxDimension: 1700,
    },
    maximum: {
        scale: 1.25,
        maxDimension: 1500,
    },
};
const PDF_LOCAL_OPERATIONS = {
    merge: {
        title: "Juntar PDFs",
        shortTitle: "Juntar",
        description: "Combine vários arquivos PDF em um único documento, mantendo a ordem selecionada.",
        icon: "paperclip",
        buttonText: "Juntar PDFs",
        fileLabel: "Arquivos PDF na ordem desejada",
        accept: ".pdf,application/pdf",
        multiple: true,
    },
    split: {
        title: "Dividir PDF",
        shortTitle: "Dividir",
        description: "Separe páginas de um PDF e baixe tudo organizado em um arquivo ZIP.",
        icon: "scissors",
        buttonText: "Dividir PDF",
        fileLabel: "Arquivo PDF",
        accept: ".pdf,application/pdf",
        pages: "Páginas para separar (opcional)",
        pagesHelp: "Deixe vazio para separar todas ou informe: 1,3-5.",
    },
    organize: {
        title: "Organizar páginas",
        shortTitle: "Organizar",
        description: "Reordene as páginas do PDF informando a sequência desejada.",
        icon: "list-ordered",
        buttonText: "Organizar páginas",
        fileLabel: "Arquivo PDF",
        accept: ".pdf,application/pdf",
        pages: "Nova ordem das páginas",
        pagesHelp: "Informe a ordem desejada. Exemplo: 3,1,2,4-6.",
        pagesRequired: true,
    },
    remove: {
        title: "Remover páginas",
        shortTitle: "Remover",
        description: "Exclua páginas específicas sem precisar recriar o documento inteiro.",
        icon: "trash-2",
        buttonText: "Remover páginas",
        fileLabel: "Arquivo PDF",
        accept: ".pdf,application/pdf",
        pages: "Páginas que serão removidas",
        pagesHelp: "Exemplo: 2,4-6.",
        pagesRequired: true,
    },
    extract: {
        title: "Extrair páginas",
        shortTitle: "Extrair",
        description: "Crie um novo PDF somente com as páginas selecionadas.",
        icon: "files",
        buttonText: "Extrair páginas",
        fileLabel: "Arquivo PDF",
        accept: ".pdf,application/pdf",
        pages: "Páginas que serão extraídas",
        pagesHelp: "Exemplo: 1,3-5.",
        pagesRequired: true,
    },
    rotate: {
        title: "Girar páginas",
        shortTitle: "Girar",
        description: "Corrija a orientação das páginas do seu PDF de forma rápida.",
        icon: "rotate-cw",
        buttonText: "Girar páginas",
        fileLabel: "Arquivo PDF",
        accept: ".pdf,application/pdf",
        pages: "Páginas para girar (opcional)",
        pagesHelp: "Deixe vazio para girar todas ou informe: 1,3-5.",
        rotation: true,
    },
    compress: {
        title: "Comprimir PDF",
        shortTitle: "Comprimir",
        description: "Reduza o tamanho dos PDFs com opções de qualidade e arquivo menor.",
        icon: "archive",
        buttonText: "Comprimir PDFs",
        fileLabel: "Arquivos PDF para compactar (até 30)",
        accept: ".pdf,application/pdf",
        multiple: true,
        compression: true,
    },
    images: {
        title: "Imagens para PDF",
        shortTitle: "Imagens",
        description: "Transforme imagens JPG ou PNG em um único arquivo PDF.",
        icon: "images",
        buttonText: "Criar PDF com imagens",
        fileLabel: "Imagens JPG ou PNG na ordem desejada",
        accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
        multiple: true,
    },
    wordPdf: {
        title: "Word para PDF",
        shortTitle: "Word PDF",
        description: "Converta documentos DOCX em PDF no navegador, mantendo o texto principal do arquivo.",
        icon: "file-text",
        buttonText: "Converter Word para PDF",
        fileLabel: "Arquivo Word (.docx)",
        accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    ocr: {
        title: "PDF pesquisável com OCR",
        shortTitle: "OCR",
        description: "Crie uma camada de texto pesquisável em PDFs digitalizados ou imagens.",
        icon: "scan-text",
        buttonText: "Criar PDFs pesquisáveis",
        fileLabel: "PDFs ou imagens para tornar pesquisáveis (até 30)",
        accept: ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp",
        multiple: true,
        ocr: true,
    },
};

const PDF_TOOL_TYPES = new Set(Object.keys(PDF_LOCAL_OPERATIONS));

const MODEL_PATHS = {
    semConjugeSemObito: "modelos/contrato_sem_conjuge.docx",
    comConjugeSemObito: "modelos/contrato_com_conjuge.docx",
    semConjugeComObito: "modelos/contrato_sem_conjuge_falecido_representante_final.docx",
    comConjugeComObito: "modelos/contrato_com_conjuge_falecido_representante_final.docx",
};

const ACCESS_PLANS = {
    test3min: {
        label: "3 minutos para teste",
        minutes: 3,
    },
    test10c: {
        label: "Teste Mercado Pago - R$ 0,10",
        days: 30,
    },
    basic30: {
        label: "30 dias plano Básico",
        days: 30,
    },
    proMax365: {
        label: "365 dias plano Pro Max",
        days: 365,
    },
};

const PAYMENT_PLANS = {
    test3min: {
        price: "Plano interno para teste",
        amount: 0,
        currency: "BRL",
        mercadoPagoReference: "test3min",
    },
    test10c: {
        price: "R$ 0,10",
        amount: 0.10,
        currency: "BRL",
        mercadoPagoReference: "test10c",
    },
    basic30: {
        price: "R$ 39,90",
        amount: 39.90,
        currency: "BRL",
        mercadoPagoReference: "basic30",
    },
    proMax365: {
        price: "R$ 490,90",
        amount: 490.90,
        currency: "BRL",
        mercadoPagoReference: "proMax365",
    },
};

const CUSTOMER_CHANGE_PLAN_IDS = ["test10c", "basic30", "proMax365"];

const PLAN_ALIASES = {
    teste3min: "test3min",
    "3-minutos": "test3min",
    test10c: "test10c",
    teste10c: "test10c",
    teste10centavos: "test10c",
    "teste-10-centavos": "test10c",
    "teste-mercado-pago": "test10c",
    test15min: "basic30",
    test5min: "basic30",
    trial15: "basic30",
    trial7: "basic30",
    monthly30: "basic30",
    annual365: "proMax365",
    basico30: "basic30",
    basic: "basic30",
    plus: "basic30",
    plus90: "basic30",
    pro: "basic30",
    pro180: "basic30",
    proMax: "proMax365",
    "pro-max": "proMax365",
    pro_max: "proMax365",
};

const PLAN_BADGES = {
    test3min: "Teste interno",
    test10c: "Teste R$ 0,10",
    basic30: "Básico",
    proMax365: "Azul intenso",
};

const DAILY_LIMIT_DOCUMENT_TYPES = new Set([
    "comodato",
    "ufba-membros",
    "renda-membros",
    "posse",
    "autodeclaracao-rural",
    "procuracao-consumidor",
    "procuracao-normal",
    "contrato-honorarios-50",
    "contrato-prev-40",
    "contrato-prev-30",
    "contrato-compra-venda-imovel",
    "contrato-compra-venda-veiculo",
    "cadastro-confrontantes",
    "controle-producao-anual",
    "controle-rebanho",
    "inventario-producao-rural",
    "contrato-arrendamento-rural",
    "contrato-comodato-equipamentos",
    "contrato-parceria-rural",
    "declaracao-posse-mansa-pacifica",
    "declaracao-residencia",
    "declaracao-nao-possuir-renda",
    "declaracao-agricultura-familiar",
    "declaracao-dependencia-economica",
    "declaracao-convivencia-familiar",
    "declaracao-baixa-renda",
    "declaracao-autenticidade-documentos",
    "declaracao-atividade-rural",
    "declaracao-uniao-estavel",
    "declaracao-tempo-trabalho-rural",
]);

const MODEL_FIELD_LABEL_REPLACEMENTS = {
    cpf: "CPF",
    cnpj: "CNPJ",
    rg: "RG",
    uf: "UF",
    itr: "ITR",
    car: "CAR",
    ccir: "CCIR",
    incra: "INCRA",
    ha: "ha",
    dn: "DN",
};

function criarDocumentoModelo({ title, description, modelPath, fileName, buttonText, sectionTitle, fields }) {
    return {
        title,
        description,
        modelPath,
        fileName,
        buttonText: buttonText || `Gerar ${title}`,
        sections: [
            {
                title: sectionTitle || "Dados do documento",
                fields: criarCamposModelo(fields),
            },
        ],
    };
}

function criarCamposModelo(fields) {
    return fields.map((name) => criarCampoModelo(name));
}

function criarCampoModelo(name) {
    const textoNormalizado = normalizarTextoBusca(name);
    return {
        name,
        label: formatarRotuloCampoModelo(name),
        placeholder: obterPlaceholderCampoModelo(textoNormalizado),
        inputmode: obterInputModeCampoModelo(textoNormalizado),
        wide: campoModeloDeveSerLargo(textoNormalizado),
        required: false,
        autocomplete: textoNormalizado.includes("email")
            ? "email"
            : textoNormalizado.startsWith("nome ") || textoNormalizado.includes(" nome ")
                ? "name"
                : undefined,
    };
}

function formatarRotuloCampoModelo(name) {
    const rotulo = String(name || "")
        .replace(/_/g, " ")
        .replace(/\bcpf cnpj\b/gi, "CPF/CNPJ")
        .split(" ")
        .map((word) => MODEL_FIELD_LABEL_REPLACEMENTS[word.toLowerCase()] || word)
        .join(" ");

    return rotulo.charAt(0).toUpperCase() + rotulo.slice(1);
}

function obterPlaceholderCampoModelo(textoNormalizado) {
    if (textoNormalizado.includes("cpf cnpj")) return "Ex.: 000.000.000-00 ou 00.000.000/0000-00";
    if (textoNormalizado.includes("cpf")) return "000.000.000-00";
    if (textoNormalizado.includes("cnpj")) return "00.000.000/0000-00";
    if (textoNormalizado.includes("data assinatura extenso")) return "Ex.: 3 de junho de 2026";
    if (textoNormalizado.includes("data")) return "Ex.: 01/06/2026";
    if (textoNormalizado.includes("ano")) return "Ex.: 2026";
    if (textoNormalizado.includes("uf")) return "Ex.: BA";
    if (textoNormalizado.includes("municipio")) return "Ex.: Amargosa";
    if (textoNormalizado.includes("valor") || textoNormalizado.includes("renda") || textoNormalizado.includes("receita") || textoNormalizado.includes("despesa")) return "Ex.: R$ 1.500,00";
    if (textoNormalizado.includes("area")) return "Ex.: 10 ha";
    if (textoNormalizado.includes("endereco") || textoNormalizado.includes("localizacao")) return "Ex.: Rua, comunidade ou zona rural";
    if (textoNormalizado.includes("estado civil")) return "Selecione";
    return "";
}

function obterInputModeCampoModelo(textoNormalizado) {
    if (textoNormalizado.includes("cpf") || textoNormalizado.includes("cnpj") || textoNormalizado.includes("ano")) {
        return "numeric";
    }

    if (textoNormalizado.includes("valor") || textoNormalizado.includes("renda") || textoNormalizado.includes("receita") || textoNormalizado.includes("despesa") || textoNormalizado.includes("area")) {
        return "decimal";
    }

    return undefined;
}

function campoModeloDeveSerLargo(textoNormalizado) {
    return [
        "endereco",
        "localizacao",
        "confrontacoes",
        "descricao",
        "atividade",
        "documentos",
        "membros",
        "benfeitorias",
        "finalidade",
        "forma",
        "motivo",
        "produtos",
        "observacoes",
    ].some((termo) => textoNormalizado.includes(termo));
}

const SIMPLE_DOCUMENTS = {
    "ufba-membros": {
        title: "Declaração UFBA de membros",
        description: "Preencha os dados do representante, produtos, valores e data da declaração.",
        modelPath: "modelos/declaracao_ufba_membros.docx",
        fileName: "declaracao-ufba-membros.docx",
        buttonText: "Gerar Declaração UFBA",
        sections: [
            {
                title: "Dados do representante",
                fields: [
                    { name: "nome_representante", label: "Nome do representante", wide: true, autocomplete: "name" },
                    { name: "rg", label: "RG" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereço", label: "Endereço", wide: true },
                    { name: "localidade", label: "Localidade", wide: true },
                ],
            },
            {
                title: "Produtos e valores",
                fields: [
                    { name: "produto1", label: "Produto 1", placeholder: "Ex.: cacau" },
                    { name: "valor1", label: "Valor do produto 1", inputmode: "decimal", placeholder: "Ex.: R$ 1.200,00" },
                    { name: "produto2", label: "Produto 2", placeholder: "Ex.: banana" },
                    { name: "valor2", label: "Valor do produto 2", inputmode: "decimal", placeholder: "Ex.: R$ 800,00" },
                    { name: "produto3", label: "Produto 3", placeholder: "Ex.: mandioca" },
                    { name: "valor3", label: "Valor do produto 3", inputmode: "decimal", placeholder: "Ex.: R$ 600,00" },
                    { name: "valor_total_numeros", label: "Valor total em números", inputmode: "decimal", placeholder: "Ex.: R$ 2.600,00" },
                    { name: "valor_total_escrito", label: "Valor total por extenso", wide: true, placeholder: "Ex.: dois mil e seiscentos reais" },
                ],
            },
            {
                title: "Data da declaração",
                fields: [
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 26" },
                    { name: "mês", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },
    "renda-membros": {
        title: "Declaração de renda de membros",
        description: "Preencha os dados do representante, membro, tipo de renda, valor anual e data.",
        modelPath: "modelos/decrlaracao_renda_membros.docx",
        fileName: "declaracao-renda-membros.docx",
        buttonText: "Gerar Declaração de Renda",
        sections: [
            {
                title: "Dados do representante",
                fields: [
                    { name: "nome_representante", label: "Nome do representante", wide: true, autocomplete: "name" },
                    { name: "rg", label: "RG" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereço", label: "Endereço", wide: true },
                    { name: "localidade", label: "Localidade", wide: true },
                ],
            },
            {
                title: "Dados da renda",
                fields: [
                    { name: "nome_mebro", label: "Nome do membro", wide: true, autocomplete: "name" },
                    { name: "tipo_renda", label: "Tipo de renda", placeholder: "Ex.: agricultura familiar" },
                    { name: "valor_anual", label: "Valor anual", inputmode: "decimal", placeholder: "Ex.: R$ 12.000,00" },
                ],
            },
            {
                title: "Data da declaração",
                fields: [
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 26" },
                    { name: "mês", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },
    posse: {
        title: "Declaração de posse",
        description: "Preencha os dados do posseiro, do imóvel, do período de posse e dos confrontantes.",
        modelPath: "modelos/declaracao_posso.docx",
        fileName: "declaracao-posse.docx",
        buttonText: "Gerar Declaração de Posse",
        sections: [
            {
                title: "Dados do posseiro",
                fields: [
                    { name: "nome_posseiro", label: "Nome do posseiro", wide: true, autocomplete: "name" },
                    { name: "estado_civil", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg", label: "RG" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereço", label: "Endereço", wide: true },
                ],
            },
            {
                title: "Dados do imóvel",
                fields: [
                    { name: "nome_imovel", label: "Nome do imóvel", wide: true, placeholder: "Ex.: Sítio Ribeirão do Cupido" },
                    { name: "área_total_imovel", label: "Área total do imóvel", placeholder: "Ex.: 3,50 hectares" },
                    { name: "período_numero", label: "Período de posse em números", placeholder: "Ex.: 10 anos" },
                    { name: "período_extenso", label: "Período de posse por extenso", wide: true, placeholder: "Ex.: dez anos" },
                ],
            },
            {
                title: "Confrontantes",
                fields: [
                    { name: "ao_norte", label: "Confrontante ao norte", placeholder: "Nome do confrontante" },
                    { name: "cpf_norte", label: "CPF do confrontante ao norte", inputmode: "numeric", placeholder: "000.000.000-00", required: false },
                    { name: "ao_sul", label: "Confrontante ao sul", placeholder: "Nome do confrontante" },
                    { name: "cpf_sul", label: "CPF do confrontante ao sul", inputmode: "numeric", placeholder: "000.000.000-00", required: false },
                    { name: "ao_leste", label: "Confrontante ao leste", placeholder: "Nome do confrontante" },
                    { name: "cpf_leste", label: "CPF do confrontante ao leste", inputmode: "numeric", placeholder: "000.000.000-00", required: false },
                    { name: "ao_oeste", label: "Confrontante ao oeste", placeholder: "Nome do confrontante" },
                    { name: "cpf_oeste", label: "CPF do confrontante ao oeste", inputmode: "numeric", placeholder: "000.000.000-00", required: false },
                ],
            },
            {
                title: "Data da declaração",
                fields: [
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 26" },
                    { name: "mês", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },
    "autodeclaracao-rural": {
        title: "Autodeclaração rural",
        description: "Preencha os dados do segurado especial rural e escolha se o documento terá representação.",
        modelPaths: {
            nao: "modelos/Autodeclaração - SEM REPRESENTAÇÃO.docx",
            sim: "modelos/Autodeclaração - COM REPRESENTAÇÃO.docx",
        },
        fileNames: {
            nao: "autodeclaracao-sem-representacao.docx",
            sim: "autodeclaracao-com-representacao.docx",
        },
        buttonText: "Gerar Autodeclaração",
        modelChoice: {
            name: "possui_representacao",
            title: "Possui representação?",
            defaultValue: "nao",
            options: [
                { value: "nao", label: "Não" },
                { value: "sim", label: "Sim" },
            ],
        },
        prepareData: prepararDadosAutodeclaracao,
        sections: [
            {
                title: "1. Dados do Segurado",
                fields: [
                    { name: "nome_segurado", label: "Nome do segurado", wide: true, autocomplete: "name" },
                    { name: "apelido_segurado", label: "Apelido", required: false },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "rg", label: "RG" },
                    { name: "data_nascimento", label: "Data de nascimento", placeholder: "Ex.: 10/05/1975" },
                    { name: "local_nascimento", label: "Local de nascimento", required: false },
                    { name: "estado_civil_segurado", label: "Estado civil", placeholder: "Ex.: Casado (a)" },
                    { name: "escolaridade_segurado", label: "Escolaridade", required: false },
                    { name: "cor_raca_segurado", label: "Cor/Raça", required: false },
                    { name: "telefone1_segurado", label: "Telefone 1", required: false },
                    { name: "telefone2_segurado", label: "Telefone 2", required: false },
                    { name: "endereco_segurado", label: "Endereço residencial", wide: true },
                    { name: "cidade", label: "Cidade", placeholder: "Ex.: Amargosa" },
                    { name: "uf", label: "UF", placeholder: "Ex.: BA" },
                    { name: "local_expedicao", label: "Local de expedição do RG", required: false },
                    { name: "data_emissao", label: "Data de emissão do RG", required: false },
                ],
            },
            {
                title: "1.1 Benefício/serviço e data da declaração",
                fields: [
                    { name: "beneficio", label: "Benefício/serviço solicitado", wide: true, placeholder: "Ex.: Aposentadoria rural" },
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 29" },
                    { name: "mes", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
            {
                title: "2. Período(s) de atividade rural (dia/mês/ano)",
                repeatableGroup: {
                    name: "periodos_atividade_rural",
                    promptText: "Possui outro período de atividade rural?",
                    addButtonText: "Adicionar outro período",
                    groups: [
                        {
                            title: "Período 1",
                            fields: [
                                { name: "periodo_inicial_1", label: "INÍCIO", required: false, placeholder: "Ex.: 01/01/2010" },
                                { name: "periodo_final_1", label: "FIM", required: false, placeholder: "Ex.: 31/12/2020" },
                                { name: "condicao_1", label: "CONDIÇÃO EM RELAÇÃO AO IMÓVEL", wide: true, required: false, placeholder: "Ex.: posseiro" },
                                { name: "situacao_individual_1", label: "Individualmente", type: "checkbox", checkedValue: "X", exclusiveGroup: "situacao_1", required: false },
                                { name: "situacao_regime_1", label: "Regime de economia familiar", type: "checkbox", checkedValue: "X", exclusiveGroup: "situacao_1", required: false },
                            ],
                        },
                        {
                            title: "Período 2",
                            fields: [
                                { name: "periodo_inicial_2", label: "INÍCIO", required: false, placeholder: "Ex.: 01/01/2021" },
                                { name: "periodo_final_2", label: "FIM", required: false, placeholder: "Ex.: 31/12/2022" },
                                { name: "condicao_2", label: "CONDIÇÃO EM RELAÇÃO AO IMÓVEL", wide: true, required: false, placeholder: "Ex.: meeiro" },
                                { name: "situacao_individual_2", label: "Individualmente", type: "checkbox", checkedValue: "X", exclusiveGroup: "situacao_2", required: false },
                                { name: "situacao_regime_2", label: "Regime de economia familiar", type: "checkbox", checkedValue: "X", exclusiveGroup: "situacao_2", required: false },
                            ],
                        },
                        {
                            title: "Período 3",
                            fields: [
                                { name: "periodo_inicial_3", label: "INÍCIO", required: false, placeholder: "Ex.: 01/01/2023" },
                                { name: "periodo_final_3", label: "FIM", required: false, placeholder: "Ex.: 31/12/2024" },
                                { name: "condicao_3", label: "CONDIÇÃO EM RELAÇÃO AO IMÓVEL", wide: true, required: false, placeholder: "Ex.: proprietário" },
                                { name: "situacao_individual_3", label: "Individualmente", type: "checkbox", checkedValue: "X", exclusiveGroup: "situacao_3", required: false },
                                { name: "situacao_regime_3", label: "Regime de economia familiar", type: "checkbox", checkedValue: "X", exclusiveGroup: "situacao_3", required: false },
                            ],
                        },
                    ],
                },
            },
            {
                title: "2.1 Condição no grupo familiar na data do requerimento",
                fields: [
                    { name: "titular", label: "Titular", type: "checkbox", checkedValue: "X", exclusiveGroup: "condicao_grupo_familiar", required: false },
                    { name: "componente", label: "Componente", type: "checkbox", checkedValue: "X", exclusiveGroup: "condicao_grupo_familiar", required: false },
                ],
            },
            {
                title: "2.2 Grupo Familiar, se exerceu ou exerce a atividade em regime de economia familiar",
                repeatableGroup: {
                    name: "familiares",
                    promptText: "Possui mais algum familiar?",
                    addButtonText: "Adicionar outro familiar",
                    groups: [
                        {
                            title: "Familiar 1",
                            fields: [
                                { name: "nome_familiar_1", label: "NOME", wide: true, required: false },
                                { name: "dn_familiar_1", label: "DN", required: false },
                                { name: "cpf_familiar_1", label: "CPF (NÚMERO)", required: false, placeholder: "000.000.000-00" },
                                { name: "estado_civil_familiar_1", label: "ESTADO CIVIL", required: false },
                                { name: "parentesco_familiar_1", label: "PARENTESCO", required: false },
                            ],
                        },
                        {
                            title: "Familiar 2",
                            fields: [
                                { name: "nome_familiar_2", label: "NOME", wide: true, required: false },
                                { name: "dn_familiar_2", label: "DN", required: false },
                                { name: "cpf_familiar_2", label: "CPF (NÚMERO)", required: false, placeholder: "000.000.000-00" },
                                { name: "estado_civil_familiar_2", label: "ESTADO CIVIL", required: false },
                                { name: "parentesco_familiar_2", label: "PARENTESCO", required: false },
                            ],
                        },
                        {
                            title: "Familiar 3",
                            fields: [
                                { name: "nome_familiar_3", label: "NOME", wide: true, required: false },
                                { name: "dn_familiar_3", label: "DN", required: false },
                                { name: "cpf_familiar_3", label: "CPF (NÚMERO)", required: false, placeholder: "000.000.000-00" },
                                { name: "estado_civil_familiar_3", label: "ESTADO CIVIL", required: false },
                                { name: "parentesco_familiar_3", label: "PARENTESCO", required: false },
                            ],
                        },
                        {
                            title: "Familiar 4",
                            fields: [
                                { name: "nome_familiar_4", label: "NOME", wide: true, required: false },
                                { name: "dn_familiar_4", label: "DN", required: false },
                                { name: "cpf_familiar_4", label: "CPF (NÚMERO)", required: false, placeholder: "000.000.000-00" },
                                { name: "estado_civil_familiar_4", label: "ESTADO CIVIL", required: false },
                                { name: "parentesco_familiar_4", label: "PARENTESCO", required: false },
                            ],
                        },
                    ],
                },
            },
            {
                title: "3.1 Informe os dados da(s) terra(s), onde exerceu ou exerce a atividade rural",
                repeatableGroup: {
                    name: "terras",
                    promptText: "Possui outra terra para informar?",
                    addButtonText: "Adicionar outra terra",
                    groups: [
                        {
                            title: "Terra 1",
                            fields: [
                                { name: "itr_terra_1", label: "Registro ITR, se possuir", required: false },
                                { name: "nome_propiedade_1", label: "Nome da propriedade", wide: true, required: false },
                                { name: "municipio_uf_1", label: "Município/UF", required: false, placeholder: "Ex.: Amargosa/BA" },
                                { name: "area_total_1", label: "Área total do imóvel (ha)", required: false, placeholder: "Ex.: 10 ha" },
                                { name: "area_explorada_1", label: "Área explorada pelo requerente (ha)", required: false, placeholder: "Ex.: 8 ha" },
                                { name: "nome_proprietario_1", label: "Nome do proprietário", wide: true, required: false },
                                { name: "cpf_proprietario_1", label: "CPF do proprietário", required: false, placeholder: "000.000.000-00" },
                            ],
                        },
                        {
                            title: "Terra 2",
                            fields: [
                                { name: "itr_terra_2", label: "Registro ITR, se possuir", required: false },
                                { name: "nome_propiedade_2", label: "Nome da propriedade", wide: true, required: false },
                                { name: "municipio_uf_2", label: "Município/UF", required: false, placeholder: "Ex.: Amargosa/BA" },
                                { name: "area_total_2", label: "Área total do imóvel (ha)", required: false },
                                { name: "area_explorada_2", label: "Área explorada pelo requerente (ha)", required: false },
                                { name: "nome_proprietario_2", label: "Nome do proprietário", wide: true, required: false },
                                { name: "cpf_proprietario_2", label: "CPF do proprietário", required: false, placeholder: "000.000.000-00" },
                            ],
                        },
                        {
                            title: "Terra 3",
                            fields: [
                                { name: "itr_terra_3", label: "Registro ITR, se possuir", required: false },
                                { name: "nome_propiedade_3", label: "Nome da propriedade", wide: true, required: false },
                                { name: "municipio_uf_3", label: "Município/UF", required: false, placeholder: "Ex.: Amargosa/BA" },
                                { name: "area_total_3", label: "Área total do imóvel (ha)", required: false },
                                { name: "area_explorada_3", label: "Área explorada pelo requerente (ha)", required: false },
                                { name: "nome_proprietario_3", label: "Nome do proprietário", wide: true, required: false },
                                { name: "cpf_proprietario_3", label: "CPF do proprietário", required: false, placeholder: "000.000.000-00" },
                            ],
                        },
                        {
                            title: "Terra 4",
                            fields: [
                                { name: "itr_terra_4", label: "Registro ITR, se possuir", required: false },
                                { name: "nome_propiedade_4", label: "Nome da propriedade", wide: true, required: false },
                                { name: "municipio_uf_4", label: "Município/UF", required: false, placeholder: "Ex.: Amargosa/BA" },
                                { name: "area_total_4", label: "Área total do imóvel (ha)", required: false },
                                { name: "area_explorada_4", label: "Área explorada pelo requerente (ha)", required: false },
                                { name: "nome_proprietario_4", label: "Nome do proprietário", wide: true, required: false },
                                { name: "cpf_proprietario_4", label: "CPF do proprietário", required: false, placeholder: "000.000.000-00" },
                            ],
                        },
                    ],
                },
            },
            {
                title: "3.2 Informe o que explora na atividade rural e destinação (milho, feijão, porcos, etc.)",
                repeatableGroup: {
                    name: "atividades_rurais",
                    promptText: "Possui outra atividade para informar?",
                    addButtonText: "Adicionar outra atividade",
                    groups: [
                        {
                            title: "Atividade 1",
                            fields: [
                                { name: "atividade_rural_1", label: "Linha 1 - ATIVIDADE", required: false, placeholder: "Ex.: mandioca" },
                                { name: "subsistencia_venda_1", label: "Linha 1 - SUBSISTÊNCIA/VENDA", required: false, placeholder: "Ex.: subsistência e venda" },
                            ],
                        },
                        {
                            title: "Atividade 2",
                            fields: [
                                { name: "atividade_rural_2", label: "Linha 2 - ATIVIDADE", required: false },
                                { name: "subsistencia_venda_2", label: "Linha 2 - SUBSISTÊNCIA/VENDA", required: false },
                            ],
                        },
                        {
                            title: "Atividade 3",
                            fields: [
                                { name: "atividade_rural_3", label: "Linha 3 - ATIVIDADE", required: false },
                                { name: "subsistencia_venda_3", label: "Linha 3 - SUBSISTÊNCIA/VENDA", required: false },
                            ],
                        },
                    ],
                },
            },
            {
                title: "3.3 Recolhimento de Imposto Sobre Produtos Industrializados - IPI",
                conditionalChoice: {
                    name: "houve_ipi",
                    title: "Houve recolhimento de IPI sobre a venda da produção?",
                    markers: { sim: "sim_ipi", nao: "nao_ipi" },
                    detailsTitle: "Período(s) de recolhimento de IPI",
                    fieldsWhenYes: [
                        { name: "ipi_periodo_1", label: "PERÍODO 1", placeholder: "Ex.: 01/01/2025 a 31/12/2025" },
                        { name: "ipi_periodo_2", label: "PERÍODO 2", required: false, placeholder: "Opcional" },
                    ],
                },
            },
            {
                title: "3.4 Empregado(s) ou prestador(es) de serviço",
                conditionalChoice: {
                    name: "possui_empregados",
                    title: "Possui empregado(s) ou prestador(es) de serviço?",
                    markers: { sim: "sim_empregados", nao: "nao_empregados" },
                    detailsTitle: "Dados do(s) empregado(s) ou prestador(es)",
                    fieldsWhenYes: [
                        { name: "empregado_nome_1", label: "Pessoa 1 - NOME", wide: true },
                        { name: "empregado_cpf_1", label: "Pessoa 1 - CPF, se possuir", required: false, placeholder: "000.000.000-00" },
                        { name: "empregado_periodo_1", label: "Pessoa 1 - PERÍODO", placeholder: "Ex.: 01/01/2025 a 31/12/2025" },
                        { name: "empregado_nome_2", label: "Pessoa 2 - NOME", wide: true, required: false },
                        { name: "empregado_cpf_2", label: "Pessoa 2 - CPF, se possuir", required: false, placeholder: "000.000.000-00" },
                        { name: "empregado_periodo_2", label: "Pessoa 2 - PERÍODO", required: false },
                        { name: "empregado_nome_3", label: "Pessoa 3 - NOME", wide: true, required: false },
                        { name: "empregado_cpf_3", label: "Pessoa 3 - CPF, se possuir", required: false, placeholder: "000.000.000-00" },
                        { name: "empregado_periodo_3", label: "Pessoa 3 - PERÍODO", required: false },
                    ],
                },
            },
            {
                title: "4. Outra atividade e/ou outra renda",
                conditionalChoice: {
                    name: "possui_outra_atividade",
                    title: "Exerce ou exerceu outra atividade e/ou recebe ou recebeu outra renda?",
                    markers: { sim: "sim_outra_atividade", nao: "nao_outra_atividade" },
                    detailsTitle: "Dados da(s) outra(s) atividade(s) ou renda(s)",
                    fieldsWhenYes: [
                        { name: "outra_atividade_renda_1", label: "Linha 1 - ATIVIDADE/RENDA", wide: true },
                        { name: "outra_atividade_local_1", label: "Linha 1 - LOCAL" },
                        { name: "outra_atividade_periodo_1", label: "Linha 1 - PERÍODO", placeholder: "Ex.: 01/01/2025 a 31/12/2025" },
                        { name: "outra_atividade_renda_2", label: "Linha 2 - ATIVIDADE/RENDA", wide: true, required: false },
                        { name: "outra_atividade_local_2", label: "Linha 2 - LOCAL", required: false },
                        { name: "outra_atividade_periodo_2", label: "Linha 2 - PERÍODO", required: false },
                        { name: "outra_atividade_renda_3", label: "Linha 3 - ATIVIDADE/RENDA", wide: true, required: false },
                        { name: "outra_atividade_local_3", label: "Linha 3 - LOCAL", required: false },
                        { name: "outra_atividade_periodo_3", label: "Linha 3 - PERÍODO", required: false },
                        { name: "outra_atividade_renda_4", label: "Linha 4 - ATIVIDADE/RENDA", wide: true, required: false },
                        { name: "outra_atividade_local_4", label: "Linha 4 - LOCAL", required: false },
                        { name: "outra_atividade_periodo_4", label: "Linha 4 - PERÍODO", required: false },
                        { name: "outra_atividade_renda_5", label: "Linha 5 - ATIVIDADE/RENDA", wide: true, required: false },
                        { name: "outra_atividade_local_5", label: "Linha 5 - LOCAL", required: false },
                        { name: "outra_atividade_periodo_5", label: "Linha 5 - PERÍODO", required: false },
                    ],
                },
            },
            {
                title: "4.1 Outra renda nas atividades indicadas no formulário",
                conditionalChoice: {
                    name: "possui_outra_renda",
                    title: "Recebe ou recebeu outra renda nas atividades indicadas no item 4.1?",
                    markers: { sim: "sim_outra_renda", nao: "nao_outra_renda" },
                    detailsTitle: "Dados da(s) renda(s)",
                    fieldsWhenYes: [
                        { name: "outra_renda_atividade_1", label: "Linha 1 - ATIVIDADE" },
                        { name: "outra_renda_periodo_1", label: "Linha 1 - PERÍODO", placeholder: "Ex.: 01/01/2025 a 31/12/2025" },
                        { name: "outra_renda_valor_1", label: "Linha 1 - RENDA (R$)", inputmode: "decimal", placeholder: "Ex.: 1.500,00" },
                        { name: "outra_renda_informacoes_1", label: "Linha 1 - OUTRAS INFORMAÇÕES", wide: true, required: false },
                        { name: "outra_renda_atividade_2", label: "Linha 2 - ATIVIDADE", required: false },
                        { name: "outra_renda_periodo_2", label: "Linha 2 - PERÍODO", required: false },
                        { name: "outra_renda_valor_2", label: "Linha 2 - RENDA (R$)", inputmode: "decimal", required: false },
                        { name: "outra_renda_informacoes_2", label: "Linha 2 - OUTRAS INFORMAÇÕES", wide: true, required: false },
                        { name: "outra_renda_atividade_3", label: "Linha 3 - ATIVIDADE", required: false },
                        { name: "outra_renda_periodo_3", label: "Linha 3 - PERÍODO", required: false },
                        { name: "outra_renda_valor_3", label: "Linha 3 - RENDA (R$)", inputmode: "decimal", required: false },
                        { name: "outra_renda_informacoes_3", label: "Linha 3 - OUTRAS INFORMAÇÕES", wide: true, required: false },
                        { name: "outra_renda_atividade_4", label: "Linha 4 - ATIVIDADE", required: false },
                        { name: "outra_renda_periodo_4", label: "Linha 4 - PERÍODO", required: false },
                        { name: "outra_renda_valor_4", label: "Linha 4 - RENDA (R$)", inputmode: "decimal", required: false },
                        { name: "outra_renda_informacoes_4", label: "Linha 4 - OUTRAS INFORMAÇÕES", wide: true, required: false },
                    ],
                },
            },
            {
                title: "4.2 Participação em cooperativa",
                conditionalChoice: {
                    name: "participa_cooperativa",
                    title: "Participa de cooperativa?",
                    markers: { sim: "sim_cooperativa", nao: "nao_cooperativa" },
                    detailsTitle: "Dados da cooperativa",
                    fieldsWhenYes: [
                        { name: "cooperativa_entidade", label: "ENTIDADE", wide: true },
                        { name: "cooperativa_cnpj", label: "CNPJ", placeholder: "00.000.000/0000-00" },
                        { name: "cooperativa_tipo", label: "Informe se é agropecuária ou de crédito rural", wide: true },
                    ],
                },
            },
        ],
    },

    "procuracao-consumidor": {
        title: "Procuração Consumidor",
        description: "Preencha os dados da pessoa, endereço, telefone e data para gerar a procuração consumidor.",
        modelPath: "modelos/procuracao_consumidor.docx",
        fileName: "procuracao-consumidor.docx",
        buttonText: "Gerar Procuração Consumidor",
        sections: [
            {
                title: "Dados da pessoa",
                fields: [
                    { name: "nome_pessoa", label: "Nome completo", wide: true, autocomplete: "name" },
                    { name: "profissao", label: "Profissão", placeholder: "Ex.: lavrador" },
                    { name: "estado_civil", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg", label: "RG" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "telefone", label: "Telefone", inputmode: "tel", placeholder: "(00) 00000-0000" },
                    { name: "endereco", label: "Endereço", wide: true, placeholder: "Rua, número, bairro ou localidade" },
                    { name: "municipio", label: "Município", placeholder: "Ex.: Amargosa" },
                ],
            },
            {
                title: "Local e data",
                fields: [
                    { name: "cidade", label: "Cidade", placeholder: "Ex.: Amargosa" },
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 30" },
                    { name: "mes", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },

    "procuracao-normal": {
        title: "Procuração Normal",
        description: "Preencha os dados da pessoa, endereço, telefone e data para gerar a procuração normal.",
        modelPath: "modelos/procuracao_normal.docx",
        fileName: "procuracao-normal.docx",
        buttonText: "Gerar Procuração Normal",
        sections: [
            {
                title: "Dados da pessoa",
                fields: [
                    { name: "nome_pessoa", label: "Nome completo", wide: true, autocomplete: "name" },
                    { name: "profissao", label: "Profissão", placeholder: "Ex.: lavrador" },
                    { name: "estado_civil", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg", label: "RG" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "telefone", label: "Telefone", inputmode: "tel", placeholder: "(00) 00000-0000" },
                    { name: "endereco", label: "Endereço", wide: true, placeholder: "Rua, número, bairro ou localidade" },
                    { name: "municipio", label: "Município", placeholder: "Ex.: Amargosa" },
                ],
            },
            {
                title: "Local e data",
                fields: [
                    { name: "cidade", label: "Cidade", placeholder: "Ex.: Amargosa" },
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 30" },
                    { name: "mes", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },

        "contrato-honorarios-50": {
        title: "Contrato Honorários 50%",
        description: "Preencha os dados da pessoa, endereço, telefone e data para gerar o contrato de honorários de 50%.",
        modelPath: "modelos/contrato_honorarios_50.docx",
        fileName: "contrato-honorarios-50.docx",
        buttonText: "Gerar Contrato 50%",
        sections: [
            {
                title: "Dados da pessoa",
                fields: [
                    { name: "nome_pessoa", label: "Nome completo", wide: true, autocomplete: "name" },
                    { name: "profissao", label: "Profissão", placeholder: "Ex.: lavrador" },
                    { name: "estado_civil", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "telefone", label: "Telefone", inputmode: "tel", placeholder: "(00) 00000-0000" },
                    { name: "endereco", label: "Endereço", wide: true, placeholder: "Rua, número, bairro ou localidade" },
                    { name: "municipio", label: "Município", placeholder: "Ex.: Amargosa" },
                ],
            },
            {
                title: "Local e data",
                fields: [
                    { name: "cidade", label: "Cidade", placeholder: "Ex.: Amargosa" },
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 30" },
                    { name: "mes", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },

    "contrato-prev-40": {
        title: "Contrato Previdenciário 40%",
        description: "Preencha os dados da pessoa, endereço, telefone e data para gerar o contrato previdenciário de 40%.",
        modelPath: "modelos/contrato_prev_40.docx",
        fileName: "contrato-prev-40.docx",
        buttonText: "Gerar Contrato 40%",
        sections: [
            {
                title: "Dados da pessoa",
                fields: [
                    { name: "nome_pessoa", label: "Nome completo", wide: true, autocomplete: "name" },
                    { name: "profissao", label: "Profissão", placeholder: "Ex.: lavrador" },
                    { name: "estado_civil", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg", label: "RG" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "telefone", label: "Telefone", inputmode: "tel", placeholder: "(00) 00000-0000" },
                    { name: "endereco", label: "Endereço", wide: true, placeholder: "Rua, número, bairro ou localidade" },
                    { name: "municipio", label: "Município", placeholder: "Ex.: Amargosa" },
                ],
            },
            {
                title: "Local e data",
                fields: [
                    { name: "cidade", label: "Cidade", placeholder: "Ex.: Amargosa" },
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 30" },
                    { name: "mes", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },

    "contrato-prev-30": {
        title: "Contrato Previdenciário 30%",
        description: "Preencha os dados da pessoa, endereço e data para gerar o contrato previdenciário de 30%.",
        modelPath: "modelos/contrato_prev_30.docx",
        fileName: "contrato-prev-30.docx",
        buttonText: "Gerar Contrato 30%",
        sections: [
            {
                title: "Dados da pessoa",
                fields: [
                    { name: "nome_pessoa", label: "Nome completo", wide: true, autocomplete: "name" },
                    { name: "profissao", label: "Profissão", placeholder: "Ex.: lavrador" },
                    { name: "estado_civil", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg", label: "RG" },
                    { name: "cpf", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereco", label: "Endereço", wide: true, placeholder: "Rua, número, bairro ou localidade" },
                    { name: "municipio", label: "Município", placeholder: "Ex.: Amargosa" },
                ],
            },
            {
                title: "Local e data",
                fields: [
                    { name: "cidade", label: "Cidade", placeholder: "Ex.: Amargosa" },
                    { name: "dia", label: "Dia", inputmode: "numeric", placeholder: "Ex.: 30" },
                    { name: "mes", label: "Mês", placeholder: "Ex.: maio" },
                    { name: "ano", label: "Ano", inputmode: "numeric", placeholder: "Ex.: 2026" },
                ],
            },
        ],
    },

    "contrato-compra-venda-imovel": {
        title: "Contrato de compra e venda",
        description: "Preencha vendedor, comprador, dados do imóvel ou bem, valores e assinatura.",
        modelPath: "modelos/contrato_compra_venda_template_sistema_negrito.docx",
        fileName: "contrato-compra-venda.docx",
        buttonText: "Gerar Contrato de Compra e Venda",
        sections: [
            {
                title: "Dados do vendedor",
                fields: [
                    { name: "nome_vendedor", label: "Nome do vendedor", wide: true, autocomplete: "name" },
                    { name: "nacionalidade_vendedor", label: "Nacionalidade", placeholder: "Ex.: brasileira" },
                    { name: "estado_civil_vendedor", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg_vendedor", label: "RG" },
                    { name: "cpf_vendedor", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereco_vendedor", label: "Endereço do vendedor", wide: true },
                ],
            },
            {
                title: "Dados do comprador",
                fields: [
                    { name: "nome_comprador", label: "Nome do comprador", wide: true, autocomplete: "name" },
                    { name: "nacionalidade_comprador", label: "Nacionalidade", placeholder: "Ex.: brasileira" },
                    { name: "estado_civil_comprador", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg_comprador", label: "RG" },
                    { name: "cpf_comprador", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereco_comprador", label: "Endereço do comprador", wide: true },
                ],
            },
            {
                title: "Dados do imóvel ou bem",
                fields: [
                    { name: "denominacao_imovel", label: "Denominação do imóvel/bem", wide: true },
                    { name: "endereco_imovel", label: "Endereço/localização", wide: true },
                    { name: "largura_imovel", label: "Largura", placeholder: "Ex.: 10 metros" },
                    { name: "comprimento_imovel", label: "Comprimento", placeholder: "Ex.: 20 metros" },
                    { name: "quantidade_bens", label: "Quantidade de bens", placeholder: "Ex.: 1 imóvel" },
                ],
            },
            {
                title: "Pagamento e assinatura",
                fields: [
                    { name: "valor_venda", label: "Valor da venda", placeholder: "Ex.: R$ 50.000,00" },
                    { name: "valor_venda_extenso", label: "Valor por extenso", wide: true, placeholder: "Ex.: cinquenta mil reais" },
                    { name: "cidade_assinatura", label: "Cidade da assinatura", placeholder: "Ex.: Amargosa" },
                    { name: "uf_assinatura", label: "UF", placeholder: "Ex.: BA" },
                    { name: "data_assinatura_extenso", label: "Data por extenso", wide: true, placeholder: "Ex.: 1 de junho de 2026" },
                    { name: "foro_comarca", label: "Foro/comarca", placeholder: "Ex.: Amargosa/BA" },
                ],
            },
        ],
    },

    "contrato-compra-venda-veiculo": {
        title: "Contrato de compra e venda de veículo/bem móvel",
        description: "Preencha vendedor, comprador, dados do veículo ou bem móvel, pagamento e entrega.",
        modelPath: "modelos/contrato_compra_venda_veiculo_bem_movel_template.docx",
        fileName: "contrato-compra-venda-veiculo-bem-movel.docx",
        buttonText: "Gerar Contrato de Veículo/Bem Móvel",
        sections: [
            {
                title: "Dados do vendedor",
                fields: [
                    { name: "nome_vendedor", label: "Nome do vendedor", wide: true, autocomplete: "name" },
                    { name: "nacionalidade_vendedor", label: "Nacionalidade", placeholder: "Ex.: brasileira" },
                    { name: "estado_civil_vendedor", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg_vendedor", label: "RG" },
                    { name: "cpf_vendedor", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereco_vendedor", label: "Endereço do vendedor", wide: true },
                ],
            },
            {
                title: "Dados do comprador",
                fields: [
                    { name: "nome_comprador", label: "Nome do comprador", wide: true, autocomplete: "name" },
                    { name: "nacionalidade_comprador", label: "Nacionalidade", placeholder: "Ex.: brasileira" },
                    { name: "estado_civil_comprador", label: "Estado civil", placeholder: "Ex.: Solteiro (a)" },
                    { name: "rg_comprador", label: "RG" },
                    { name: "cpf_comprador", label: "CPF", inputmode: "numeric", placeholder: "000.000.000-00" },
                    { name: "endereco_comprador", label: "Endereço do comprador", wide: true },
                ],
            },
            {
                title: "Dados do veículo ou bem móvel",
                fields: [
                    { name: "tipo_bem", label: "Tipo do bem", placeholder: "Ex.: veículo, moto, trator" },
                    { name: "marca_bem", label: "Marca" },
                    { name: "modelo_bem", label: "Modelo" },
                    { name: "ano_modelo_bem", label: "Ano/modelo" },
                    { name: "cor_bem", label: "Cor" },
                    { name: "placa_veiculo", label: "Placa", required: false },
                    { name: "renavam_veiculo", label: "RENAVAM", required: false },
                    { name: "chassi_ou_serie", label: "Chassi ou número de série", required: false },
                    { name: "quilometragem_veiculo", label: "Quilometragem", required: false },
                    { name: "estado_conservacao_bem", label: "Estado de conservação", wide: true },
                    { name: "descricao_complementar_bem", label: "Descrição complementar", wide: true, required: false },
                ],
            },
            {
                title: "Pagamento, entrega e transferência",
                fields: [
                    { name: "valor_venda", label: "Valor da venda", placeholder: "Ex.: R$ 25.000,00" },
                    { name: "valor_venda_extenso", label: "Valor por extenso", wide: true },
                    { name: "forma_pagamento", label: "Forma de pagamento", wide: true },
                    { name: "data_entrega_bem", label: "Data de entrega do bem", placeholder: "Ex.: 01/06/2026" },
                    { name: "local_entrega_bem", label: "Local de entrega", wide: true },
                    { name: "responsavel_transferencia", label: "Responsável pela transferência", wide: true },
                ],
            },
            {
                title: "Testemunhas e assinatura",
                fields: [
                    { name: "cpf_testemunha_1", label: "CPF da testemunha 1", inputmode: "numeric", required: false, placeholder: "000.000.000-00" },
                    { name: "cpf_testemunha_2", label: "CPF da testemunha 2", inputmode: "numeric", required: false, placeholder: "000.000.000-00" },
                    { name: "cidade_assinatura", label: "Cidade da assinatura", placeholder: "Ex.: Amargosa" },
                    { name: "uf_assinatura", label: "UF", placeholder: "Ex.: BA" },
                    { name: "data_assinatura", label: "Data da assinatura", placeholder: "Ex.: 01/06/2026" },
                    { name: "data_assinatura_extenso", label: "Data por extenso", wide: true, placeholder: "Ex.: 1 de junho de 2026" },
                    { name: "foro_comarca", label: "Foro/comarca", placeholder: "Ex.: Amargosa/BA" },
                ],
            },
        ],
    },

    "cadastro-confrontantes": criarDocumentoModelo({
        title: "Cadastro de confrontantes",
        description: "Informe declarante, imovel rural e confrontantes ao norte, sul, leste e oeste.",
        modelPath: "modelos/cadastro_confrontantes_template(1).docx",
        fileName: "cadastro-confrontantes.docx",
        sectionTitle: "Dados do cadastro de confrontantes",
        fields: ["area_imovel", "cidade_assinatura", "cpf_cnpj_confrontante_leste", "cpf_cnpj_confrontante_norte", "cpf_cnpj_confrontante_oeste", "cpf_cnpj_confrontante_sul", "cpf_declarante", "data_assinatura_extenso", "endereco_confrontante_leste", "endereco_confrontante_norte", "endereco_confrontante_oeste", "endereco_confrontante_sul", "endereco_declarante", "endereco_imovel_rural", "estado_civil_declarante", "imovel_confrontante_leste", "imovel_confrontante_norte", "imovel_confrontante_oeste", "imovel_confrontante_sul", "municipio_imovel", "nacionalidade_declarante", "nome_confrontante_leste", "nome_confrontante_norte", "nome_confrontante_oeste", "nome_confrontante_sul", "nome_declarante", "nome_imovel_rural", "registro_imovel", "rg_declarante", "uf_assinatura", "uf_imovel"],
    }),

    "controle-producao-anual": criarDocumentoModelo({
        title: "Controle de producao anual",
        description: "Registre produtos, quantidades, vendas, despesas e receita anual da producao rural.",
        modelPath: "modelos/controle_producao_anual_template(1).docx",
        fileName: "controle-producao-anual.docx",
        sectionTitle: "Dados do controle de producao anual",
        fields: ["ano_referencia", "area_imovel", "atividade_1", "atividade_2", "atividade_3", "cidade_assinatura", "cpf_produtor", "data_assinatura_extenso", "data_fim_ano", "data_inicio_ano", "despesas_anuais", "despesas_anuais_extenso", "endereco_imovel_rural", "endereco_produtor", "estado_civil_produtor", "estoque_final_1", "estoque_final_2", "estoque_final_3", "municipio_imovel", "nacionalidade_produtor", "nome_imovel_rural", "nome_produtor", "quantidade_produzida_1", "quantidade_produzida_2", "quantidade_produzida_3", "quantidade_vendida_1", "quantidade_vendida_2", "quantidade_vendida_3", "receita_bruta_anual", "receita_bruta_extenso", "registro_rural", "rg_produtor", "saldo_estimado", "uf_assinatura", "uf_imovel", "unidade_1", "unidade_2", "unidade_3", "valor_total_1", "valor_total_2", "valor_total_3"],
    }),

    "controle-rebanho": criarDocumentoModelo({
        title: "Controle de rebanho",
        description: "Controle entradas, saidas, quantidade final, vacinacao e identificacao do rebanho.",
        modelPath: "modelos/controle_rebanho_template(1).docx",
        fileName: "controle-rebanho.docx",
        sectionTitle: "Dados do controle de rebanho",
        fields: ["ano_controle", "categoria_1", "categoria_2", "categoria_3", "cidade_assinatura", "controle_sanitario", "cpf_produtor", "data_assinatura_extenso", "data_fim_controle", "data_inicio_controle", "endereco_produtor", "endereco_propriedade", "entradas_1", "entradas_2", "entradas_3", "especie_1", "especie_2", "especie_3", "estado_civil_produtor", "forma_identificacao", "municipio_propriedade", "nacionalidade_produtor", "nome_produtor", "nome_propriedade", "quantidade_final_1", "quantidade_final_2", "quantidade_final_3", "quantidade_inicial_1", "quantidade_inicial_2", "quantidade_inicial_3", "registro_propriedade", "rg_produtor", "saidas_1", "saidas_2", "saidas_3", "total_compras", "total_mortes", "total_nascimentos", "total_transferencias", "total_vendas", "uf_assinatura", "uf_propriedade", "vacinacao_rebanho"],
    }),

    "inventario-producao-rural": criarDocumentoModelo({
        title: "Inventario de producao rural",
        description: "Liste produtos, areas, quantidades, valores e destino da producao rural.",
        modelPath: "modelos/inventario_producao_rural_template.docx",
        fileName: "inventario-producao-rural.docx",
        sectionTitle: "Dados do inventario de producao rural",
        fields: ["ano_safra", "area_imovel", "area_produto_1", "area_produto_2", "area_produto_3", "cidade_assinatura", "cpf_produtor", "data_assinatura_extenso", "data_fim_periodo", "data_inicio_periodo", "destino_producao", "endereco_imovel_rural", "endereco_produtor", "estado_civil_produtor", "local_armazenamento", "municipio_imovel", "nacionalidade_produtor", "nome_imovel_rural", "nome_produtor", "produto_1", "produto_2", "produto_3", "quantidade_produto_1", "quantidade_produto_2", "quantidade_produto_3", "registro_rural", "rg_produtor", "uf_assinatura", "uf_imovel", "unidade_produto_1", "unidade_produto_2", "unidade_produto_3", "valor_produto_1", "valor_produto_2", "valor_produto_3"],
    }),

    "contrato-arrendamento-rural": criarDocumentoModelo({
        title: "Contrato de arrendamento rural",
        description: "Preencha arrendador, arrendatario, imovel, prazo, pagamento e foro.",
        modelPath: "modelos/contrato_arrendamento_rural_template.docx",
        fileName: "contrato-arrendamento-rural.docx",
        sectionTitle: "Dados do contrato de arrendamento rural",
        fields: ["area_total_ha", "car_imovel", "ccir_incra", "cidade_assinatura", "confrontacoes_imovel", "cpf_cnpj_arrendador", "cpf_cnpj_arrendatario", "data_assinatura_extenso", "data_fim", "data_inicio", "denominacao_imovel", "dia_vencimento", "endereco_arrendador", "endereco_arrendatario", "estado_civil_arrendador", "estado_civil_arrendatario", "finalidade_arrendamento", "forma_pagamento", "foro_comarca", "foro_uf", "indice_reajuste", "localizacao_imovel", "matricula_imovel", "municipio", "nacionalidade_arrendador", "nacionalidade_arrendatario", "nome_arrendador", "nome_arrendatario", "numero_vias", "periodicidade_pagamento", "prazo_arrendamento", "prazo_aviso_rescisao", "prazo_inadimplencia", "profissao_arrendador", "profissao_arrendatario", "rg_arrendador", "rg_arrendatario", "uf", "uf_assinatura", "valor_arrendamento", "valor_arrendamento_extenso"],
    }),

    "contrato-comodato-equipamentos": criarDocumentoModelo({
        title: "Contrato de comodato de equipamentos",
        description: "Preencha comodante, comodatario, equipamentos, acessorios, prazo e responsabilidades.",
        modelPath: "modelos/contrato_comodato_equipamentos_template.docx",
        fileName: "contrato-comodato-equipamentos.docx",
        sectionTitle: "Dados do contrato de comodato de equipamentos",
        fields: ["acessorios_1", "acessorios_2", "acessorios_3", "cidade_assinatura", "cpf_cnpj_comodante", "cpf_cnpj_comodatario", "data_assinatura_extenso", "data_fim", "data_inicio", "endereco_comodante", "endereco_comodatario", "equipamento_1", "equipamento_2", "equipamento_3", "estado_civil_comodante", "estado_civil_comodatario", "estado_conservacao_1", "estado_conservacao_2", "estado_conservacao_3", "finalidade_uso_equipamento", "foro_comarca", "foro_uf", "marca_modelo_1", "marca_modelo_2", "marca_modelo_3", "nacionalidade_comodante", "nacionalidade_comodatario", "nome_comodante", "nome_comodatario", "numero_vias", "prazo_comodato", "profissao_comodante", "profissao_comodatario", "regra_manutencao_extraordinaria", "responsavel_despesas", "rg_comodante", "rg_comodatario", "serie_chassi_1", "serie_chassi_2", "serie_chassi_3", "uf_assinatura"],
    }),

    "contrato-parceria-rural": criarDocumentoModelo({
        title: "Contrato de parceria rural",
        description: "Preencha outorgante, outorgado, area, atividade, percentuais, despesas e foro.",
        modelPath: "modelos/contrato_parceria_rural_template.docx",
        fileName: "contrato-parceria-rural.docx",
        sectionTitle: "Dados do contrato de parceria rural",
        fields: ["area_parceria_ha", "atividade_parceria", "cidade_assinatura", "cpf_cnpj_outorgado", "cpf_cnpj_outorgante", "data_assinatura_extenso", "data_fim", "data_inicio", "denominacao_area", "descricao_atividade", "divisao_despesas", "endereco_outorgado", "endereco_outorgante", "estado_civil_outorgado", "estado_civil_outorgante", "foro_comarca", "foro_uf", "localizacao_area", "matricula_area", "municipio", "nacionalidade_outorgado", "nacionalidade_outorgante", "nome_outorgado", "nome_outorgante", "numero_vias", "percentual_outorgado", "percentual_outorgante", "periodicidade_apuracao", "periodicidade_prestacao_contas", "prazo_aviso_rescisao", "prazo_parceria", "profissao_outorgado", "profissao_outorgante", "rg_outorgado", "rg_outorgante", "uf", "uf_assinatura"],
    }),

    "declaracao-posse-mansa-pacifica": criarDocumentoModelo({
        title: "Declaracao de posse mansa e pacifica",
        description: "Declare posse, localizacao, confrontantes, finalidade de uso e benfeitorias.",
        modelPath: "modelos/declaracao_posse_mansa_pacifica_template.docx",
        fileName: "declaracao-posse-mansa-pacifica.docx",
        sectionTitle: "Dados da declaracao de posse mansa e pacifica",
        fields: ["area_aproximada", "benfeitorias_atividades", "cidade_assinatura", "confrontante_leste", "confrontante_norte", "confrontante_oeste", "confrontante_sul", "coordenadas_referencia", "cpf_cnpj_declarante", "data_assinatura_extenso", "data_inicio_posse", "denominacao_imovel", "endereco_declarante", "estado_civil_declarante", "finalidade_uso", "localizacao_imovel", "municipio", "nacionalidade_declarante", "nome_declarante", "profissao_declarante", "rg_declarante", "uf", "uf_assinatura"],
    }),

    "declaracao-residencia": criarDocumentoModelo({
        title: "Declaracao de residencia",
        description: "Informe residencia, titular do comprovante, orgao de destino e data.",
        modelPath: "modelos/declaracao_residencia_template.docx",
        fileName: "declaracao-residencia.docx",
        sectionTitle: "Dados da declaracao de residencia",
        fields: ["bairro_residencia", "cep_residencia", "cidade_assinatura", "cidade_residencia", "cpf_declarante", "cpf_titular_comprovante", "data_assinatura_extenso", "data_inicio_residencia", "endereco_declarante", "endereco_residencia", "estado_civil_declarante", "nacionalidade_declarante", "nome_declarante", "nome_titular_comprovante", "orgao_destino", "profissao_declarante", "rg_declarante", "uf_assinatura", "uf_residencia"],
    }),

    "declaracao-nao-possuir-renda": criarDocumentoModelo({
        title: "Declaracao de nao possuir renda",
        description: "Informe declarante, forma de manutencao, ajuda eventual e orgao de destino.",
        modelPath: "modelos/declaracao_nao_possuir_renda_template.docx",
        fileName: "declaracao-nao-possuir-renda.docx",
        sectionTitle: "Dados da declaracao de nao possuir renda",
        fields: ["cidade_assinatura", "cpf_declarante", "cpf_responsavel_ajuda", "data_assinatura_extenso", "endereco_declarante", "estado_civil_declarante", "forma_manutencao", "nacionalidade_declarante", "nome_declarante", "nome_responsavel_ajuda", "orgao_destino", "profissao_declarante", "rg_declarante", "uf_assinatura", "valor_ajuda_eventual"],
    }),

    "declaracao-agricultura-familiar": criarDocumentoModelo({
        title: "Declaracao de agricultura familiar",
        description: "Informe atividade em agricultura familiar, imovel rural, produtos e membros familiares.",
        modelPath: "modelos/declaracao_exercicio_agricultura_familiar_template.docx",
        fileName: "declaracao-agricultura-familiar.docx",
        sectionTitle: "Dados da declaracao de agricultura familiar",
        fields: ["area_explorada", "cidade_assinatura", "cpf_declarante", "data_assinatura_extenso", "data_inicio_agricultura_familiar", "endereco_declarante", "endereco_imovel_rural", "estado_civil_declarante", "fonte_renda_agricultura_familiar", "membros_familiares_atividade", "municipio_imovel_rural", "nacionalidade_declarante", "nome_declarante", "nome_imovel_rural", "orgao_destino", "produtos_agricultura_familiar", "profissao_declarante", "rg_declarante", "uf_assinatura", "uf_imovel_rural"],
    }),

    "declaracao-dependencia-economica": criarDocumentoModelo({
        title: "Declaracao de dependencia economica",
        description: "Informe declarante, dependente, parentesco, renda e motivo da dependencia.",
        modelPath: "modelos/declaracao_dependencia_economica_template.docx",
        fileName: "declaracao-dependencia-economica.docx",
        sectionTitle: "Dados da declaracao de dependencia economica",
        fields: ["cidade_assinatura", "cpf_declarante", "cpf_dependente", "data_assinatura_extenso", "data_inicio_dependencia", "endereco_declarante", "estado_civil_declarante", "motivo_dependencia", "nacionalidade_declarante", "nome_declarante", "nome_dependente", "orgao_destino", "parentesco_dependente", "profissao_declarante", "renda_dependente", "rg_declarante", "uf_assinatura"],
    }),

    "declaracao-convivencia-familiar": criarDocumentoModelo({
        title: "Declaracao de convivencia familiar",
        description: "Informe convivencia familiar, parentesco, endereco e finalidade da declaracao.",
        modelPath: "modelos/declaracao_convivencia_familiar_template.docx",
        fileName: "declaracao-convivencia-familiar.docx",
        sectionTitle: "Dados da declaracao de convivencia familiar",
        fields: ["cidade_assinatura", "cpf_declarante", "cpf_familiar_convivente", "data_assinatura_extenso", "data_inicio_convivencia", "endereco_convivencia_familiar", "endereco_declarante", "estado_civil_declarante", "finalidade_declaracao", "grau_parentesco_convivente", "nacionalidade_declarante", "nome_declarante", "nome_familiar_convivente", "orgao_destino", "profissao_declarante", "rg_declarante", "uf_assinatura"],
    }),

    "declaracao-baixa-renda": criarDocumentoModelo({
        title: "Declaracao de baixa renda",
        description: "Informe renda individual, renda familiar, membros da familia e orgao de destino.",
        modelPath: "modelos/declaracao_baixa_renda_template.docx",
        fileName: "declaracao-baixa-renda.docx",
        sectionTitle: "Dados da declaracao de baixa renda",
        fields: ["cidade_assinatura", "cpf_declarante", "data_assinatura_extenso", "endereco_declarante", "estado_civil_declarante", "nacionalidade_declarante", "nome_declarante", "nomes_membros_familiares", "orgao_destino", "profissao_declarante", "quantidade_membros_familiares", "renda_familiar_mensal", "renda_mensal_individual", "renda_per_capita", "rg_declarante", "uf_assinatura"],
    }),

    "declaracao-autenticidade-documentos": criarDocumentoModelo({
        title: "Declaracao de autenticidade de documentos",
        description: "Declare a autenticidade dos documentos apresentados ao orgao de destino.",
        modelPath: "modelos/declaracao_autenticidade_documentos_template.docx",
        fileName: "declaracao-autenticidade-documentos.docx",
        sectionTitle: "Dados da declaracao de autenticidade de documentos",
        fields: ["cidade_assinatura", "cpf_declarante", "data_assinatura_extenso", "endereco_declarante", "estado_civil_declarante", "lista_documentos_autenticados", "nacionalidade_declarante", "nome_declarante", "orgao_destino", "profissao_declarante", "rg_declarante", "uf_assinatura"],
    }),

    "declaracao-atividade-rural": criarDocumentoModelo({
        title: "Declaracao de atividade rural",
        description: "Informe periodo, funcao rural, forma de exercicio, imovel e renda media.",
        modelPath: "modelos/declaracao_atividade_rural_template.docx",
        fileName: "declaracao-atividade-rural.docx",
        sectionTitle: "Dados da declaracao de atividade rural",
        fields: ["cidade_assinatura", "cpf_declarante", "data_assinatura_extenso", "data_fim_atividade_rural", "data_inicio_atividade_rural", "descricao_atividade_rural", "endereco_declarante", "endereco_imovel_rural", "estado_civil_declarante", "forma_exercicio_atividade", "funcao_rural", "municipio_imovel_rural", "nacionalidade_declarante", "nome_declarante", "nome_imovel_rural", "orgao_destino", "profissao_declarante", "renda_media_rural", "rg_declarante", "uf_assinatura", "uf_imovel_rural"],
    }),

    "declaracao-uniao-estavel": criarDocumentoModelo({
        title: "Declaracao de uniao estavel",
        description: "Informe os conviventes, residencia do casal, inicio da uniao e regime de bens.",
        modelPath: "modelos/declaracao_uniao_estavel_template.docx",
        fileName: "declaracao-uniao-estavel.docx",
        sectionTitle: "Dados da declaracao de uniao estavel",
        fields: ["cidade_assinatura", "cpf_convivente_1", "cpf_convivente_2", "data_assinatura_extenso", "data_inicio_uniao_estavel", "endereco_convivente_1", "endereco_convivente_2", "endereco_residencia_casal", "estado_civil_convivente_1", "estado_civil_convivente_2", "nacionalidade_convivente_1", "nacionalidade_convivente_2", "nome_convivente_1", "nome_convivente_2", "orgao_destino", "profissao_convivente_1", "profissao_convivente_2", "regime_bens_uniao", "rg_convivente_1", "rg_convivente_2", "uf_assinatura"],
    }),

    "declaracao-tempo-trabalho-rural": criarDocumentoModelo({
        title: "Declaracao de tempo de trabalho rural",
        description: "Informe periodo de trabalho rural, propriedade, responsavel e atividades desempenhadas.",
        modelPath: "modelos/declaracao_tempo_trabalho_rural_template.docx",
        fileName: "declaracao-tempo-trabalho-rural.docx",
        sectionTitle: "Dados da declaracao de tempo de trabalho rural",
        fields: ["atividades_desempenhadas", "cidade_assinatura", "condicao_trabalho_rural", "cpf_declarante", "cpf_responsavel_propriedade", "data_assinatura_extenso", "data_fim_trabalho_rural", "data_inicio_trabalho_rural", "endereco_declarante", "endereco_propriedade_rural", "estado_civil_declarante", "frequencia_trabalho_rural", "municipio_propriedade_rural", "nacionalidade_declarante", "nome_declarante", "nome_propriedade_rural", "nome_responsavel_propriedade", "orgao_destino", "profissao_declarante", "rg_declarante", "uf_assinatura", "uf_propriedade_rural"],
    }),
};

const LIBRARIES = [
    {
        label: "Docxtemplater",
        globalName: "docxtemplater",
        urls: [
            "https://cdn.jsdelivr.net/npm/docxtemplater@3.67.3/build/docxtemplater.js",
            "https://unpkg.com/docxtemplater@3.67.3/build/docxtemplater.js",
        ],
    },
    {
        label: "PizZip",
        globalName: "PizZip",
        urls: [
            "https://unpkg.com/pizzip@3.2.0/dist/pizzip.js",
            "https://cdn.jsdelivr.net/npm/pizzip@3.2.0/dist/pizzip.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/pizzip/3.2.0/pizzip.min.js",
        ],
    },
    {
        label: "FileSaver",
        globalName: "saveAs",
        urls: [
            "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js",
            "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js",
            "https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js",
        ],
    },
];

const FIELD_LABELS = {
    nome_comandante: "Nome completo do comodante",
    estado_civil_comandante: "Estado civil do comodante",
    profissao_comandante: "Profissão do comodante",
    rg_comandante: "RG do comodante",
    cpf_comandante: "CPF/CNPJ do comodante",
    localidade_comandante: "Localidade do comodante",
    nome_comandatario: "Nome completo do comodatário",
    estado_civil_comandatario: "Estado civil do comodatário",
    profissao_comandatario: "Profissão do comodatário",
    oque_produz: "O que o comodatário produz",
    rg_comandatario: "RG do comodatário",
    cpf_comandatario: "CPF/CNPJ do comodatário",
    localidade_comandatario: "Localidade do comodatário",
    "município_comandatrio": "Município do comodatário",
    localidade_proxima_comandatario: "Comunidade ou localidade próxima",
    nome_imovel: "Nome do imóvel rural",
    localidade_imovel_rural: "Localidade do imóvel rural",
    nirf_terra: "NIRF do imóvel",
    tamanho_trerra_numeros: "Área do imóvel em números",
    tamanho_terra_letras: "Área do imóvel por extenso",
    tamanho_utilizado_numeros: "Área utilizada em números",
    tamanho_utilizado_letras: "Área utilizada por extenso",
    "duração_contrato": "Duração do contrato",
    data_inicio: "Data de início na propriedade",
    dia: "Dia da assinatura",
    mes: "Mês da assinatura",
    ano: "Ano da assinatura",
    nome_conjuge: "Nome completo do cônjuge/companheiro(a)",
    nacionalidade_conjuge: "Nacionalidade do cônjuge/companheiro(a)",
    estado_civil_conjuge: "Estado civil do cônjuge/companheiro(a)",
    profissao_conjuge: "Profissão do cônjuge/companheiro(a)",
    rg_conjuge: "RG do cônjuge/companheiro(a)",
    cpf_conjuge: "CPF do cônjuge/companheiro(a)",
    localidade_conjuge: "Localidade do cônjuge/companheiro(a)",
    localidade_proxima_conjuge: "Comunidade ou localidade próxima do cônjuge/companheiro(a)",
    municipio_conjuge: "Município do cônjuge/companheiro(a)",
    data_falecimento: "Data do falecimento",
    numero_obito: "Número do óbito",
    representante_do_falecido: "Nome completo do representante do falecido",
    parentesco_representante: "Parentesco do representante",
    rg_representante: "RG do representante",
    cpf_representante: "CPF do representante",
    endereco_representante: "Endereço do representante",
};

registrarServiceWorker();
preencherSelectPlanos(adminUserPlan);
configurarAvisoPrivacidade();
configurarLogin();
configurarPagamentoPlanos();
configurarAtendimento();
configurarAtualizacaoAutomaticaUsoDiario();
configurarFerramentasPdfLocais();
configurarExperienciaProduto();
configurarFotoPerfil();
configurarTemaSistema();
configurarTemaLiquidGlass();
configurarNavegacaoDocumentos();
configurarTelaInicialDocumentos();
configurarFormularioContrato();
configurarExperienciaFormulario(form, {
    title: "Contrato de comodato rural",
});
configurarFormularioDocumentoSimples();
configurarControleDocumentosAdmin();
configurarControleSaldoAdmin();
configurarControlePdfAdmin();
configurarPainelAdmin();
inicializarIcones();
iniciarTelaCarregamento();

function iniciarTelaCarregamento() {
    if (!startupSplash) {
        document.body.classList.remove("splash-open");
        inicializarSessao();
        return;
    }

    window.setTimeout(() => {
        startupSplash.classList.add("is-hiding");
        document.body.classList.remove("splash-open");
        inicializarSessao();

        window.setTimeout(() => {
            startupSplash.remove();
        }, 460);
    }, STARTUP_SPLASH_DURATION_MS);
}

function configurarAvisoPrivacidade() {
    privacyModal.classList.add("is-hidden");

    privacyAcceptButton.addEventListener("click", () => {
        privacyModal.classList.add("is-hidden");
        localStorage.setItem(PRIVACY_ACCEPTED_STORAGE_KEY, "yes");
        document.body.classList.remove("modal-open");
    });
}

function mostrarAvisoPrivacidadeSeNecessario() {
    if (localStorage.getItem(PRIVACY_ACCEPTED_STORAGE_KEY) === "yes") {
        return;
    }

    privacyModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
        privacyAcceptButton.focus();
    }, 120);
}

function preencherSelectPlanos(selectElement) {
    if (!selectElement) {
        return;
    }

    selectElement.textContent = "";

    Object.entries(ACCESS_PLANS).forEach(([planId, plan]) => {
        const option = document.createElement("option");
        option.value = planId;
        option.textContent = obterTextoPlanoSelect(planId, plan.label);
        selectElement.appendChild(option);
    });
}

function obterTextoPlanoSelect(planId, label) {
    const badge = PLAN_BADGES[planId];
    return badge ? `${label} - ${badge}` : label;
}

function configurarLogin() {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagemLogin();

        if (!validarLogin()) {
            return;
        }

        alternarLoginCarregamento(true, "Entrando...");

        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: {
                    email: loginEmail.value.trim(),
                    password: loginPassword.value,
                },
            });

            aplicarSessao(data);
        } catch (error) {
            console.error(error);

            if (error?.data?.code === "PAYMENT_REQUIRED" && error.data.billingToken && error.data.user) {
                prepararCobrancaDeAcessoBloqueado(error.data);
                return;
            }

            mostrarLoginMensagem(traduzirErroApi(error), "error");
        } finally {
            alternarLoginCarregamento(false);
        }
    });
}

function configurarPagamentoPlanos() {
    renewPlanButton.addEventListener("click", abrirRenovacaoPlano);
    changePlanButton.addEventListener("click", abrirAlteracaoPlano);
    paymentCloseButton.addEventListener("click", fecharPagamentoPlano);
    paymentCancelButton.addEventListener("click", fecharPagamentoPlano);
    paymentShowQrButton.addEventListener("click", iniciarPagamentoMercadoPago);
    paymentCopyPixButton?.addEventListener("click", copiarCodigoPixAtual);
    paymentVerifyButton?.addEventListener("click", verificarPagamentoAtual);
    paymentProofForm.addEventListener("submit", enviarComprovantePagamento);
    blockedRenewButton.addEventListener("click", () => {
        fecharAvisoAcessoBloqueado();
        abrirRenovacaoPlano();
    });
    blockedChangePlanButton.addEventListener("click", () => {
        fecharAvisoAcessoBloqueado();
        abrirAlteracaoPlano();
    });
    blockedSupportButton.addEventListener("click", () => {
        fecharAvisoAcessoBloqueado();
        abrirAtendimento();
    });
    renewalWarningRenewButton.addEventListener("click", () => {
        fecharAvisoRenovacao();
        abrirRenovacaoPlano();
    });
    renewalWarningCloseButton.addEventListener("click", fecharAvisoRenovacao);

    paymentModal.addEventListener("click", (event) => {
        if (event.target === paymentModal) {
            fecharPagamentoPlano();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !paymentModal.classList.contains("is-hidden")) {
            fecharPagamentoPlano();
        }
    });
}

function configurarAtendimento() {
    supportChatButton.addEventListener("click", abrirAtendimento);
    supportChatCloseButton.addEventListener("click", fecharAtendimento);
    supportChatModal.addEventListener("click", (event) => {
        if (event.target === supportChatModal) {
            fecharAtendimento();
        }
    });
    supportChatForm.addEventListener("submit", enviarMensagemAtendimento);
}

function prepararCobrancaDeAcessoBloqueado(data) {
    billingUser = data.user;
    localStorage.setItem(BILLING_TOKEN_KEY, data.billingToken);
    accessBlockedDescription.textContent = data.message || "Seu plano venceu. Renove ou altere seu plano para solicitar a liberação.";
    accessBlockedModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    blockedRenewButton.focus();
}

function fecharAvisoAcessoBloqueado() {
    accessBlockedModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
}

function mostrarAvisoRenovacao(texto) {
    if (!texto) {
        return;
    }

    renewalWarningText.textContent = texto;
    renewalWarningModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    renewalWarningRenewButton.focus();
}

function fecharAvisoRenovacao() {
    renewalWarningModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
}

async function abrirAtendimento() {
    supportChatModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    atualizarCamposVisitanteAtendimento();
    await carregarMensagensAtendimento();
    supportMessage.focus();
}

function fecharAtendimento() {
    supportChatModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
}

function atualizarCamposVisitanteAtendimento() {
    const identificado = Boolean(usuarioAtual?.email || billingUser?.email);
    supportGuestFields.classList.toggle("is-hidden", identificado);

    if (identificado) {
        supportGuestName.value = usuarioAtual?.name || billingUser?.name || "";
        supportGuestEmail.value = usuarioAtual?.email || billingUser?.email || "";
    }
}

async function carregarMensagensAtendimento() {
    const identificado = Boolean(usuarioAtual?.email || billingUser?.email);

    if (!identificado) {
        supportChatMessages.innerHTML = '<p class="support-chat-empty">Informe seus dados e envie a primeira mensagem. O administrador responderá pelo histórico vinculado ao seu e-mail.</p>';
        return;
    }

    supportChatMessages.innerHTML = '<p class="support-chat-empty">Carregando conversa...</p>';

    try {
        const data = await apiRequest("/api/support/messages");
        renderizarMensagensAtendimento(data.messages || []);
    } catch (error) {
        supportChatMessages.innerHTML = `<p class="support-chat-empty">${escaparHtmlSeguro(traduzirErroApi(error))}</p>`;
    }
}

function renderizarMensagensAtendimento(messages) {
    if (!messages.length) {
        supportChatMessages.innerHTML = '<p class="support-chat-empty">Nenhuma mensagem ainda. Envie sua dúvida ou comprovante.</p>';
        return;
    }

    supportChatMessages.innerHTML = messages.map((item) => `
        <article class="support-chat-bubble ${item.senderType === "admin" ? "is-admin" : "is-customer"}">
            <strong>${item.senderType === "admin" ? "Atendimento" : "Você"}</strong>
            ${item.message ? `<p>${escaparHtmlSeguro(item.message)}</p>` : ""}
            ${item.attachmentName ? `<span class="support-attachment-label"><i data-lucide="paperclip" aria-hidden="true"></i>${escaparHtmlSeguro(item.attachmentName)}</span>` : ""}
            <time>${formatarDataHora(item.createdAt)}</time>
        </article>
    `).join("");
    supportChatMessages.scrollTop = supportChatMessages.scrollHeight;
    inicializarIcones();
}

async function enviarMensagemAtendimento(event) {
    event.preventDefault();
    supportChatMessage.textContent = "";
    const arquivo = supportAttachment.files[0];
    const identificado = Boolean(usuarioAtual?.email || billingUser?.email);

    try {
        supportChatSubmitButton.disabled = true;
        supportChatSubmitButton.textContent = "Enviando...";
        const attachment = arquivo ? await prepararAnexoParaEnvio(arquivo) : undefined;
        await apiRequest("/api/support/messages", {
            method: "POST",
            body: {
                name: identificado ? undefined : supportGuestName.value.trim(),
                email: identificado ? undefined : supportGuestEmail.value.trim(),
                message: supportMessage.value.trim(),
                attachment,
            },
        });
        supportMessage.value = "";
        supportAttachment.value = "";
        supportChatMessage.textContent = "Mensagem enviada.";
        supportChatMessage.className = "message success";
        await carregarMensagensAtendimento();
    } catch (error) {
        supportChatMessage.textContent = traduzirErroApi(error);
        supportChatMessage.className = "message error";
    } finally {
        supportChatSubmitButton.disabled = false;
        supportChatSubmitButton.textContent = "Enviar mensagem";
    }
}

async function prepararAnexoParaEnvio(file) {
    if (!file) {
        return undefined;
    }

    if (file.size > 1500 * 1024) {
        throw new Error("O arquivo deve ter no máximo 1,5 MB.");
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
        throw new Error("Envie um arquivo JPG, PNG ou PDF.");
    }

    return {
        name: file.name,
        type: file.type,
        data: await lerArquivoComoDataUrl(file),
    };
}

function lerArquivoComoDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Não foi possível ler o arquivo selecionado."));
        reader.readAsDataURL(file);
    });
}

async function enviarComprovantePagamento(event) {
    event.preventDefault();
    paymentProofMessage.textContent = "O envio manual de comprovante ficou desativado. A renovação será feita pela confirmação automática do Mercado Pago.";
    paymentProofMessage.className = "message";
}

function configurarFerramentasPdfLocais() {
    pdfLocalToolButtons.forEach((button) => {
        button.addEventListener("click", () => selecionarFerramentaPdfLocal(button.dataset.pdfLocalOperation, { abrirPainel: true }));
    });

    pdfLocalStartUploadButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selecionarFerramentaPdfLocal(button.dataset.pdfLocalStartUpload || "merge", { abrirPainel: true });
            pdfLocalFiles?.click();
        });
    });

    pdfLocalCategoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const shortcut = button.dataset.pdfLocalShortcut;

            if (shortcut) {
                selecionarFerramentaPdfLocal(shortcut, { abrirPainel: true });
                return;
            }

            mostrarHomeFerramentasPdfLocal();
        });
    });

    pdfLocalBackToToolsButton?.addEventListener("click", mostrarHomeFerramentasPdfLocal);
    pdfLocalUpgradeButton.addEventListener("click", abrirAlteracaoPlano);
    pdfLocalFiles.addEventListener("change", lidarMudancaArquivosPdfLocal);
    configurarArrastarSoltarPdfLocal();
    window.addEventListener("beforeunload", limparPreVisualizacaoPdfLocal);

    pdfLocalForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagemPdfLocal();

        if (!usuarioPodeUsarFerramentasPdf()) {
            mostrarMensagemPdfLocal("As ferramentas PDF não estão liberadas para este login.", "error");
            return;
        }

        if (!ferramentaPdfEstaDisponivel(pdfLocalOperation)) {
            mostrarMensagemPdfLocal(montarMensagemLimitePdf(pdfLocalOperation), "error");
            return;
        }

        const arquivos = obterArquivosSelecionadosPdfLocal();

        if (!arquivos.length) {
            mostrarMensagemPdfLocal("Escolha ao menos um arquivo.", "error");
            pdfLocalFiles.focus();
            return;
        }

        if (arquivos.length > PDF_LOCAL_MAX_FILES) {
            mostrarMensagemPdfLocal(`Escolha no máximo ${PDF_LOCAL_MAX_FILES} arquivos por vez.`, "error");
            return;
        }

        if (arquivos.some((arquivo) => arquivo.size > PDF_LOCAL_MAX_FILE_BYTES)) {
            mostrarMensagemPdfLocal("Cada arquivo deve ter no máximo 50 MB.", "error");
            return;
        }

        if (ferramentaPdfUsaServidor(pdfLocalOperation) && !pdfToolUsage.unlimited && arquivos.length > obterSaldoFerramentaPdf(pdfLocalOperation)) {
            mostrarMensagemPdfLocal(`Saldo insuficiente para processar ${arquivos.length} arquivos. Disponivel: ${obterSaldoFerramentaPdf(pdfLocalOperation)}.`, "error");
            return;
        }
        alternarCarregamentoPdfLocal(true);

        try {
            if (!ferramentaPdfUsaServidor(pdfLocalOperation)) {
                await registrarUsoFerramentaPdfLocalComFallback(pdfLocalOperation);
            }

            const mensagem = await processarFerramentaPdfLocal(arquivos);
            mostrarMensagemPdfLocal(mensagem || "Arquivo preparado com sucesso. O download foi iniciado.", "success");
        } catch (error) {
            console.error(error);
            mostrarMensagemPdfLocal(traduzirErroApi(error), "error");
        } finally {
            alternarCarregamentoPdfLocal(false);
        }
    });

    selecionarFerramentaPdfLocal(pdfLocalOperation, { abrirPainel: false });
    mostrarHomeFerramentasPdfLocal();
    atualizarCartaoPdfLocal();
}

function selecionarFerramentaPdfLocal(operation, options = {}) {
    pdfLocalOperation = operation;
    const config = PDF_LOCAL_OPERATIONS[operation] || PDF_LOCAL_OPERATIONS.merge;

    pdfLocalToolButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.pdfLocalOperation === operation);
    });

    limparPreVisualizacaoPdfLocal();
    limparPainelLotePdfLocal();
    pdfLocalSelectedFiles = [];
    pdfLocalFiles.value = "";
    sincronizarArquivosSelecionadosPdfLocal();
    pdfLocalFiles.accept = config.accept;
    pdfLocalFiles.multiple = Boolean(config.multiple);
    pdfLocalFileLabel.textContent = config.fileLabel;
    pdfLocalPagesField.classList.toggle("is-hidden", !config.pages);
    pdfLocalPages.required = Boolean(config.pagesRequired);
    pdfLocalPages.value = "";
    pdfLocalPagesLabel.textContent = config.pages || "Páginas";
    pdfLocalPagesHelp.textContent = config.pagesHelp || "";
    pdfLocalRotationField.classList.toggle("is-hidden", !config.rotation);
    pdfLocalCompressionField.classList.toggle("is-hidden", !config.compression);
    pdfLocalOcrLanguageField.classList.toggle("is-hidden", !config.ocr);
    pdfLocalSubmitButton.textContent = config.buttonText;
    atualizarCabecalhoFerramentaPdfLocal(config);
    atualizarAtalhosCategoriaPdfLocal(operation);
    limparMensagemPdfLocal();
    atualizarBotoesFerramentasPdf();

    if (options.abrirPainel) {
        mostrarPainelOperacaoPdfLocal();
    }
}

function atualizarCabecalhoFerramentaPdfLocal(config) {
    if (pdfLocalOperationTitle) {
        pdfLocalOperationTitle.textContent = config.title || config.buttonText;
    }

    if (pdfLocalOperationDescription) {
        pdfLocalOperationDescription.textContent = config.description || "Prepare seu PDF com segurança no navegador.";
    }

    if (pdfLocalOperationKicker) {
        pdfLocalOperationKicker.textContent = config.title || config.buttonText;
    }

    if (pdfLocalOperationIcon) {
        pdfLocalOperationIcon.innerHTML = `<i data-lucide="${config.icon || "file-text"}" aria-hidden="true"></i>`;
        inicializarIcones();
    }
}

function atualizarAtalhosCategoriaPdfLocal(operation) {
    if (!pdfLocalCategoryButtons.length) {
        return;
    }

    const categoriaAtiva = {
        organize: "organize",
        compress: "optimize",
        images: "convert",
        wordPdf: "convert",
        ocr: "intelligence",
    }[operation] || "all";

    pdfLocalCategoryButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.pdfLocalCategory === categoriaAtiva);
    });
}
function mostrarPainelOperacaoPdfLocal() {
    pdfLocalToolsHome?.classList.add("is-hidden");
    pdfLocalOperationPanel?.classList.remove("is-hidden");
    pdfLocalOperationPanel?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function mostrarHomeFerramentasPdfLocal() {
    limparMensagemPdfLocal();
    limparPreVisualizacaoPdfLocal();
    limparPainelLotePdfLocal();
    pdfLocalToolsHome?.classList.remove("is-hidden");
    pdfLocalOperationPanel?.classList.add("is-hidden");
    atualizarAtalhosCategoriaPdfLocal("");
}
function abrirFerramentasPdfLocais() {
    if (!usuarioPodeUsarFerramentasPdf()) {
        mostrarMensagemAcesso("As ferramentas PDF não estão liberadas para este login.", "error");
        mostrarTela("documents");
        return;
    }

    mostrarTela("pdfLocal");
    limparFormularioPdfLocal();
    atualizarCartaoPdfLocal();
}
function atualizarCartaoPdfLocal() {
    const liberado = usuarioPodeUsarFerramentasPdf();
    const restanteAtual = obterSaldoFerramentaPdf(pdfLocalOperation);
    pdfLocalCard.classList.toggle("document-card-disabled", !liberado);
    pdfLocalCard.classList.toggle("is-hidden", Boolean(usuarioAtual) && !liberado && !usuarioAtualEhAdmin);
    pdfLocalCardStatus.textContent = liberado
        ? (pdfToolUsage.unlimited ? "PDF liberado" : `PDF ${restanteAtual}`)
        : "PDF bloqueado";
    pdfLocalLock.classList.toggle("is-hidden", liberado);
    pdfLocalWorkspace.classList.toggle("is-hidden", !liberado);
    atualizarBotoesFerramentasPdf();
}

function atualizarBotoesFerramentasPdf() {
    if (!pdfLocalToolButtons.length) {
        return;
    }

    const liberado = usuarioPodeUsarFerramentasPdf();

    pdfLocalToolButtons.forEach((button) => {
        const toolType = button.dataset.pdfLocalOperation;
        const restante = obterSaldoFerramentaPdf(toolType);
        const bloqueado = !ferramentaPdfEstaDisponivel(toolType);
        button.disabled = !liberado || bloqueado;
        button.classList.toggle("pdf-local-tool-blocked", !liberado || bloqueado);
        button.title = !liberado
            ? "Ferramenta PDF nao liberada para este login."
            : bloqueado
                ? montarMensagemLimitePdf(toolType)
                : "";

        let quota = button.querySelector("[data-pdf-tool-quota]");

        if (!quota) {
            quota = document.createElement("em");
            quota.className = "pdf-tool-badge pdf-tool-quota-badge";
            quota.dataset.pdfToolQuota = "true";
            const quotaContainer = button.querySelector(".pdf-local-tool-heading") || button;
            quotaContainer.appendChild(quota);
        }

        quota.textContent = pdfToolUsage.unlimited ? "Livre" : `Disponível ${restante}`;
        quota.classList.toggle("is-empty", !pdfToolUsage.unlimited && restante <= 0);
    });

    if (pdfLocalSubmitButton) {
        pdfLocalSubmitButton.disabled = !ferramentaPdfEstaDisponivel(pdfLocalOperation);
    }
}

function ferramentaPdfEstaDisponivel(toolType) {
    if (!usuarioPodeUsarFerramentasPdf()) {
        return false;
    }

    if (pdfToolUsage.unlimited) {
        return true;
    }

    return obterSaldoFerramentaPdf(toolType) > 0;
}

function obterSaldoFerramentaPdf(toolType) {
    if (pdfToolUsage.unlimited) {
        return Infinity;
    }

    const quota = pdfToolUsage.tools?.[toolType];
    return Math.max(0, Number(quota?.remaining ?? pdfToolUsage.limit ?? 0));
}

function montarMensagemLimitePdf(toolType) {
    const titulo = obterTituloFerramentaPdf(toolType);
    const horario = obterHorarioResetUsoDiario();

    if (pdfToolUsage.renewalEnabled === false) {
        return `Voce atingiu o saldo disponivel para ${titulo}. A renovacao diaria esta desligada para este login.`;
    }

    return `Voce atingiu o saldo disponivel para ${titulo}. A renovacao diaria adiciona +${pdfToolUsage.dailyAdd || pdfToolUsage.limit || 5} as ${horario}.`;
}

function ferramentaPdfUsaServidor(toolType) {
    return toolType === "compress" || toolType === "ocr";
}

async function registrarUsoFerramentaPdfLocalComFallback(toolType) {
    try {
        await registrarUsoFerramentaPdfNoServidor(toolType);
    } catch (error) {
        if (!deveIgnorarFalhaTecnicaUsoPdf(error)) {
            throw error;
        }

        console.warn("Nao foi possivel registrar o uso da ferramenta PDF. Processando localmente mesmo assim.", error);
        consumirUsoFerramentaPdfEmMemoria(toolType);
    }
}

function consumirUsoFerramentaPdfEmMemoria(toolType) {
    if (!pdfToolUsage || pdfToolUsage.unlimited) {
        return;
    }

    const atual = pdfToolUsage.tools?.[toolType];

    if (!atual) {
        return;
    }

    const restante = Math.max(0, Number(atual.remaining ?? atual.available ?? 0) - 1);
    pdfToolUsage = {
        ...pdfToolUsage,
        tools: {
            ...(pdfToolUsage.tools || {}),
            [toolType]: {
                ...atual,
                used: Math.max(0, Number(atual.used || 0) + 1),
                remaining: restante,
                available: restante,
                blocked: restante === 0,
            },
        },
    };
    atualizarCartaoPdfLocal();
    atualizarBotoesFerramentasPdf();
}

function deveIgnorarFalhaTecnicaUsoPdf(error) {
    const status = Number(error?.status || 0);
    const message = String(error?.data?.message || error?.message || "");

    if ([401, 403, 429].includes(status)) {
        return false;
    }

    return !status
        || status === 404
        || status >= 500
        || /Rota nao encontrada|Failed to fetch|NetworkError|Erro na API/i.test(message);
}

async function processarFerramentaPdfLocal(arquivos) {
    if (pdfLocalOperation === "merge") {
        garantirBibliotecaPdfLocal();
        return juntarPdfsLocais(arquivos);
    }

    if (pdfLocalOperation === "images") {
        garantirBibliotecaPdfLocal();
        return converterImagensParaPdfLocal(arquivos);
    }

    if (pdfLocalOperation === "wordPdf") {
        garantirBibliotecasWordParaPdfLocal();
        return converterWordParaPdfLocal(arquivos[0]);
    }

    if (ferramentaPdfPermiteLote(pdfLocalOperation) && arquivos.length > 1) {
        return processarLotePdfLocal(arquivos, pdfLocalOperation);
    }

    if (arquivos.length !== 1) {
        throw new Error("Escolha apenas um arquivo para esta ferramenta.");
    }

    if (pdfLocalOperation === "ocr") {
        const resultado = await processarOcrPdfComFallbackBytes(arquivos[0]);
        baixarBytesPdfLocal(resultado.bytes, resultado.fileName);
        return resultado.message;
    }

    if (pdfLocalOperation === "compress") {
        const resultado = await processarCompactacaoPdfComFallbackBytes(arquivos[0]);
        baixarBytesPdfLocal(resultado.bytes, resultado.fileName);
        return resultado.message;
    }

    garantirBibliotecaPdfLocal();
    const pdf = await carregarPdfLocal(arquivos[0]);

    if (pdfLocalOperation === "split") {
        return dividirPdfLocal(pdf);
    }

    if (pdfLocalOperation === "organize") {
        return criarPdfComPaginasLocais(pdf, obterPaginasPdfLocais(pdf, { required: true, allowRepeats: true }), "pdf-organizado.pdf");
    }

    if (pdfLocalOperation === "remove") {
        return removerPaginasPdfLocal(pdf);
    }

    if (pdfLocalOperation === "extract") {
        return criarPdfComPaginasLocais(pdf, obterPaginasPdfLocais(pdf, { required: true }), "paginas-extraidas.pdf");
    }

    if (pdfLocalOperation === "rotate") {
        return girarPaginasPdfLocal(pdf);
    }

    throw new Error("Ferramenta PDF invalida.");
}

function ferramentaPdfPermiteLote(toolType) {
    return toolType === "compress" || toolType === "ocr";
}

async function processarLotePdfLocal(arquivos, toolType) {
    garantirBibliotecaZipPdfLocal();

    if (toolType === "compress") {
        arquivos.forEach((arquivo) => {
            if (!arquivoEhPdfLocal(arquivo)) {
                throw new Error("Escolha apenas arquivos PDF para compactar em lote.");
            }
        });
    }

    if (toolType === "ocr") {
        arquivos.forEach(validarImagemOuPdfParaOcrServidor);
    }

    prepararPainelLotePdfLocal(arquivos, toolType);

    const zip = new window.PizZip();
    let somaOriginal = 0;
    let somaFinal = 0;

    for (let index = 0; index < arquivos.length; index += 1) {
        const arquivo = arquivos[index];
        atualizarItemLotePdfLocal(index, "processando", "Processando...");
        mostrarMensagemPdfLocal(`${obterTituloFerramentaPdf(toolType)}: processando ${index + 1} de ${arquivos.length}...`, "");

        const resultado = toolType === "compress"
            ? await processarCompactacaoPdfComFallbackBytes(arquivo, { index: index + 1, total: arquivos.length })
            : await processarOcrPdfComFallbackBytes(arquivo, { index: index + 1, total: arquivos.length });

        zip.file(resultado.fileName, resultado.bytes);
        somaOriginal += Number(arquivo.size || 0);
        somaFinal += Number(resultado.bytes?.length || 0);
        atualizarItemLotePdfLocal(index, "pronto", `Pronto - ${formatarTamanhoArquivo(resultado.bytes.length)}`);
        await aguardarProximoFramePdfLocal();
    }

    const zipName = toolType === "ocr" ? "pdfs-com-ocr.zip" : "pdfs-compactados.zip";
    saveAs(zip.generate({ type: "blob", compression: "DEFLATE" }), zipName);

    if (toolType === "compress" && somaOriginal > 0) {
        const economia = Math.max(0, somaOriginal - somaFinal);
        const percentual = Math.round((economia / somaOriginal) * 100);
        return `Lote concluido: ${arquivos.length} PDFs compactados em ZIP. Economia aproximada: ${percentual}% (${formatarTamanhoArquivo(somaOriginal)} para ${formatarTamanhoArquivo(somaFinal)}).`;
    }

    return `Lote concluido: ${arquivos.length} arquivo${arquivos.length === 1 ? "" : "s"} processado${arquivos.length === 1 ? "" : "s"}. O ZIP foi baixado.`;
}

function garantirBibliotecaZipPdfLocal() {
    if (typeof window.PizZip !== "function" || typeof window.saveAs !== "function") {
        throw new Error("A biblioteca de ZIP ainda nao foi carregada. Atualize a pagina e tente novamente.");
    }
}

function obterPainelLotePdfLocal() {
    let painel = document.getElementById("pdfLocalBatchPanel");

    if (!painel) {
        painel = document.createElement("div");
        painel.id = "pdfLocalBatchPanel";
        painel.className = "pdf-local-batch-panel is-hidden";
        pdfLocalMessage.insertAdjacentElement("afterend", painel);
    }

    return painel;
}

function prepararPainelLotePdfLocal(arquivos, toolType) {
    const painel = obterPainelLotePdfLocal();
    painel.innerHTML = `
        <div class="pdf-local-batch-header">
            <strong>${toolType === "ocr" ? "OCR em lote" : "Compactacao em lote"}</strong>
            <span>${arquivos.length} de ${PDF_LOCAL_MAX_FILES} arquivos</span>
        </div>
        <div class="pdf-local-batch-list">
            ${arquivos.map((arquivo, index) => `
                <article class="pdf-local-batch-item" data-pdf-batch-index="${index}">
                    <span>${escaparHtmlSeguro(arquivo.name)}</span>
                    <small>Aguardando</small>
                </article>
            `).join("")}
        </div>
    `;
    painel.classList.remove("is-hidden");
}

function atualizarItemLotePdfLocal(index, status, texto) {
    const item = document.querySelector(`[data-pdf-batch-index="${index}"]`);

    if (!item) {
        return;
    }

    item.dataset.status = status;
    const detalhe = item.querySelector("small");

    if (detalhe) {
        detalhe.textContent = texto;
    }
}

function limparPainelLotePdfLocal() {
    const painel = document.getElementById("pdfLocalBatchPanel");

    if (painel) {
        painel.classList.add("is-hidden");
        painel.innerHTML = "";
    }
}

async function processarOcrPdfComFallback(arquivo) {
    const resultado = await processarOcrPdfComFallbackBytes(arquivo);
    baixarBytesPdfLocal(resultado.bytes, resultado.fileName);
    return resultado.message;
}

async function processarOcrPdfComFallbackBytes(arquivo, contexto = {}) {
    try {
        return await processarPdfNoServidorResultado(arquivo, "ocr", contexto);
    } catch (error) {
        if (!deveTentarCompactacaoLocalAposFalhaServidor(error)) {
            throw error;
        }

        console.warn("Servidor de OCR falhou. Usando OCR local como fallback.", error);
        mostrarMensagemPdfLocal("Servidor de OCR falhou. Fazendo OCR no navegador...", "");
        await registrarUsoFerramentaPdfLocalComFallback("ocr");
        return gerarPdfPesquisavelOcrLocal(arquivo, {
            download: false,
            fileName: montarNomePdfProcessadoLocal(arquivo, "ocr"),
        });
    }
}

async function processarCompactacaoPdfComFallback(arquivo) {
    const resultado = await processarCompactacaoPdfComFallbackBytes(arquivo);
    baixarBytesPdfLocal(resultado.bytes, resultado.fileName);
    return resultado.message;
}

async function processarCompactacaoPdfComFallbackBytes(arquivo, contexto = {}) {
    try {
        return await processarPdfNoServidorResultado(arquivo, "compress", contexto);
    } catch (error) {
        if (!deveTentarCompactacaoLocalAposFalhaServidor(error)) {
            throw error;
        }

        console.warn("Servidor de PDF falhou. Usando compactacao local como fallback.", error);
        mostrarMensagemPdfLocal("Servidor de PDF falhou. Compactando no navegador...", "");
        await registrarUsoFerramentaPdfLocalComFallback("compress");
        garantirBibliotecaPdfLocal();
        const pdf = await carregarPdfLocal(arquivo);
        const resultado = await compactarPdfLocal(pdf, arquivo, {
            download: false,
            fileName: montarNomePdfProcessadoLocal(arquivo, "compactado"),
        });
        return {
            ...resultado,
            message: `${resultado.message} Fallback local usado porque o servidor de PDF falhou.`,
        };
    }
}

function montarNomePdfProcessadoLocal(arquivo, sufixo) {
    const nome = String(arquivo?.name || "documento.pdf").replace(/\.[^.]+$/, "");
    const limpo = nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9_-]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "documento";

    return `${limpo}-${sufixo}.pdf`;
}
function deveTentarCompactacaoLocalAposFalhaServidor(error) {
    const status = Number(error?.status || 0);
    const message = String(error?.data?.message || error?.message || "");
    return status >= 500
        || /Servico de PDF falhou|Nao foi possivel processar o PDF|servico de pdf/i.test(message);
}

async function processarPdfNoServidorResultado(arquivo, toolType, contexto = {}) {
    if (toolType === "compress" && !arquivoEhPdfLocal(arquivo)) {
        throw new Error("Escolha um arquivo PDF para compactar.");
    }

    if (toolType === "ocr") {
        validarImagemOuPdfParaOcrServidor(arquivo);
    }

    const prefixo = contexto.total ? ` (${contexto.index}/${contexto.total})` : "";
    mostrarMensagemPdfLocal(toolType === "compress"
        ? `Enviando PDF${prefixo} para compactacao segura no servidor...`
        : `Enviando arquivo${prefixo} para OCR otimizado no servidor...`, "");

    const fileBase64 = await arquivoParaBase64SemPrefixo(arquivo);
    const data = await apiRequest("/api/pdf-tools/process", {
        method: "POST",
        body: {
            toolType,
            fileName: arquivo.name || "documento.pdf",
            fileBase64,
            options: {
                level: pdfLocalCompressionLevel?.value || "balanced",
                language: pdfLocalOcrLanguage?.value || "por",
            },
        },
    });

    if (!data?.success || !data.pdfBase64) {
        throw new Error(data?.message || "O servidor nao devolveu o PDF processado.");
    }

    const bytes = base64ParaUint8Array(data.pdfBase64);
    const fileName = data.fileName && !/^pdf-(compactado|pesquisavel-ocr)\.pdf$/i.test(data.fileName)
        ? data.fileName
        : montarNomePdfProcessadoLocal(arquivo, toolType === "ocr" ? "ocr" : "compactado");

    if (data.pdfToolUsage) {
        pdfToolUsage = data.pdfToolUsage;
        atualizarBotoesFerramentasPdf();
        atualizarCartaoPdfLocal();
    }

    return {
        bytes,
        fileName,
        message: data.message || (toolType === "ocr"
            ? "OCR concluido no servidor. O PDF pesquisavel foi preparado."
            : "PDF compactado no servidor."),
    };
}

async function processarPdfNoServidor(arquivo, toolType) {
    const resultado = await processarPdfNoServidorResultado(arquivo, toolType);
    baixarBytesPdfLocal(resultado.bytes, resultado.fileName);
    return resultado.message;
}
function validarImagemOuPdfParaOcrServidor(arquivo) {
    if (arquivoEhPdfLocal(arquivo)) {
        return;
    }

    validarImagemParaOcrLocal(arquivo);
}

function arquivoParaBase64SemPrefixo(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || "");
            resolve(result.includes(",") ? result.split(",").pop() : result);
        };
        reader.onerror = () => reject(new Error("Nao foi possivel ler o arquivo selecionado."));
        reader.readAsDataURL(arquivo);
    });
}

function base64ParaUint8Array(base64) {
    const binary = atob(String(base64 || ""));
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

async function juntarPdfsLocais(arquivos) {
    if (arquivos.length < 2) {
        throw new Error("Escolha pelo menos dois arquivos PDF para juntar.");
    }

    const { PDFDocument } = window.PDFLib;
    const destino = await PDFDocument.create();

    for (const arquivo of arquivos) {
        const origem = await carregarPdfLocal(arquivo);
        const indices = origem.getPageIndices();
        const paginas = await destino.copyPages(origem, indices);
        paginas.forEach((pagina) => destino.addPage(pagina));
    }

    return baixarPdfLocal(destino, "pdf-unido.pdf");
}

async function dividirPdfLocal(pdf) {
    if (typeof window.PizZip !== "function") {
        throw new Error("A biblioteca de compactação não foi carregada. Atualize a página e tente novamente.");
    }

    const indices = obterPaginasPdfLocais(pdf, { optional: true });
    const zip = new window.PizZip();

    for (const index of indices) {
        const pagina = await copiarPaginasPdfLocais(pdf, [index]);
        zip.file(`pagina-${index + 1}.pdf`, await pagina.save());
    }

    saveAs(zip.generate({ type: "blob", compression: "DEFLATE" }), "paginas-separadas.zip");
}

async function removerPaginasPdfLocal(pdf) {
    const removidas = new Set(obterPaginasPdfLocais(pdf, { required: true }));
    const mantidas = pdf.getPageIndices().filter((index) => !removidas.has(index));

    if (!mantidas.length) {
        throw new Error("O PDF precisa manter ao menos uma página.");
    }

    return criarPdfComPaginasLocais(pdf, mantidas, "pdf-sem-paginas-removidas.pdf");
}

async function girarPaginasPdfLocal(pdf) {
    const { degrees } = window.PDFLib;
    const indices = obterPaginasPdfLocais(pdf, { optional: true });
    const rotacao = Number(pdfLocalRotation.value || 90);

    indices.forEach((index) => {
        const pagina = pdf.getPage(index);
        pagina.setRotation(degrees((pagina.getRotation().angle + rotacao) % 360));
    });

    return baixarPdfLocal(pdf, "pdf-com-paginas-giradas.pdf");
}

async function compactarPdfLocal(pdf, arquivoOriginal, options = {}) {
    const resultado = await compactarPdfLocalComResultado(pdf, arquivoOriginal, options);

    if (options.download === false) {
        return resultado;
    }

    baixarBytesPdfLocal(resultado.bytes, resultado.fileName);
    return resultado.message;
}

async function compactarPdfLocalComResultado(pdf, arquivoOriginal, options = {}) {
    const tamanhoOriginal = arquivoOriginal.size;
    const bytesOriginais = new Uint8Array(await arquivoOriginal.arrayBuffer());
    const bytesEstruturais = await pdf.save({
        useObjectStreams: true,
    });
    const nivel = PDF_LOCAL_COMPRESSION_LEVELS[pdfLocalCompressionLevel.value]
        || PDF_LOCAL_COMPRESSION_LEVELS.strong;
    const possuiTextoSelecionavel = await pdfPossuiTextoSelecionavelLocal(bytesOriginais);
    const candidatos = [
        { tipo: "original", bytes: bytesOriginais },
        { tipo: "estrutural", bytes: bytesEstruturais },
    ];

    if (!possuiTextoSelecionavel) {
        const bytesRasterizados = await compactarPdfPorRasterizacaoLocal(bytesOriginais, nivel);
        candidatos.push({ tipo: nivel.label, bytes: bytesRasterizados });
    }
    const melhor = candidatos.reduce((menor, candidato) => {
        return candidato.bytes.length < menor.bytes.length ? candidato : menor;
    });
    const tamanhoFinal = melhor.bytes.length;
    const economia = tamanhoOriginal - tamanhoFinal;
    const fileName = options.fileName || montarNomePdfProcessadoLocal(arquivoOriginal, "compactado");

    if (economia > 0) {
        const percentual = Math.max(1, Math.round((economia / tamanhoOriginal) * 100));
        const preservacao = possuiTextoSelecionavel ? " OCR/texto preservado." : "";
        return {
            bytes: melhor.bytes,
            fileName,
            message: `PDF compactado com estrategia ${melhor.tipo}: ${formatarTamanhoArquivo(tamanhoOriginal)} para ${formatarTamanhoArquivo(tamanhoFinal)} (${percentual}% menor).${preservacao}`,
        };
    }

    const motivo = possuiTextoSelecionavel
        ? " O OCR/texto foi preservado, entao a compactacao visual que apagaria a camada pesquisavel nao foi usada."
        : "";
    return {
        bytes: melhor.bytes,
        fileName,
        message: `Nao foi possivel reduzir este PDF sem aumentar o arquivo. O original ja estava otimizado (${formatarTamanhoArquivo(tamanhoOriginal)}).${motivo}`,
    };
}
async function pdfPossuiTextoSelecionavelLocal(bytesOriginais) {
    garantirBibliotecaCompactacaoVisualPdfLocal();

    let documento = null;
    const tarefa = window.pdfjsLib.getDocument({ data: bytesOriginais.slice() });

    try {
        documento = await tarefa.promise;

        for (let numeroPagina = 1; numeroPagina <= documento.numPages; numeroPagina += 1) {
            const pagina = await documento.getPage(numeroPagina);

            try {
                const conteudo = await pagina.getTextContent();
                const possuiTexto = (conteudo.items || []).some((item) => String(item.str || "").trim().length > 0);

                if (possuiTexto) {
                    return true;
                }
            } finally {
                pagina.cleanup();
            }
        }

        return false;
    } catch (error) {
        console.warn("Nao foi possivel verificar texto selecionavel no PDF. Preservando OCR por seguranca.", error);
        return true;
    } finally {
        if (documento) {
            await documento.destroy();
        } else if (tarefa?.destroy) {
            await tarefa.destroy();
        }
    }
}

async function compactarPdfPorRasterizacaoLocal(bytesOriginais, nivel) {
    garantirBibliotecaCompactacaoVisualPdfLocal();

    const { PDFDocument } = window.PDFLib;
    const tarefa = window.pdfjsLib.getDocument({ data: bytesOriginais.slice() });
    const origem = await tarefa.promise;
    const destino = await PDFDocument.create();

    try {
        for (let numeroPagina = 1; numeroPagina <= origem.numPages; numeroPagina += 1) {
            mostrarMensagemPdfLocal(`Compactando página ${numeroPagina} de ${origem.numPages}...`, "");
            await aguardarProximoFramePdfLocal();

            const paginaOrigem = await origem.getPage(numeroPagina);
            const viewportBase = paginaOrigem.getViewport({ scale: 1 });
            let viewport = paginaOrigem.getViewport({ scale: nivel.scale });
            const ajusteDimensao = Math.min(1, nivel.maxDimension / Math.max(viewport.width, viewport.height));

            if (ajusteDimensao < 1) {
                viewport = paginaOrigem.getViewport({ scale: nivel.scale * ajusteDimensao });
            }

            const canvas = document.createElement("canvas");
            const contexto = canvas.getContext("2d", { alpha: false });

            if (!contexto) {
                throw new Error("Este navegador não conseguiu preparar a compactação visual.");
            }

            canvas.width = Math.max(1, Math.ceil(viewport.width));
            canvas.height = Math.max(1, Math.ceil(viewport.height));
            contexto.fillStyle = "#ffffff";
            contexto.fillRect(0, 0, canvas.width, canvas.height);

            await paginaOrigem.render({
                canvasContext: contexto,
                viewport,
                background: "#ffffff",
            }).promise;

            const imagemBlob = await converterCanvasEmBlobPdfLocal(canvas, "image/jpeg", nivel.jpegQuality);
            const imagem = await destino.embedJpg(await imagemBlob.arrayBuffer());
            const paginaDestino = destino.addPage([viewportBase.width, viewportBase.height]);
            paginaDestino.drawImage(imagem, {
                x: 0,
                y: 0,
                width: viewportBase.width,
                height: viewportBase.height,
            });

            paginaOrigem.cleanup();
            canvas.width = 1;
            canvas.height = 1;
        }

        return await destino.save({ useObjectStreams: true });
    } finally {
        await origem.destroy();
    }
}

function converterCanvasEmBlobPdfLocal(canvas, tipo, qualidade) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
                return;
            }

            reject(new Error("Não foi possível compactar uma das páginas."));
        }, tipo, qualidade);
    });
}

function aguardarProximoFramePdfLocal() {
    return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}

function garantirBibliotecaCompactacaoVisualPdfLocal() {
    if (!window.pdfjsLib?.getDocument) {
        throw new Error("A biblioteca de compactação visual não foi carregada. Atualize a página e tente novamente.");
    }

    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
}

async function gerarPdfPesquisavelOcrLocal(arquivo, options = {}) {
    garantirBibliotecaOcrLocal();

    const { PDFDocument } = window.PDFLib;
    const idioma = pdfLocalOcrLanguage.value || "por";
    const pdfPesquisavel = await PDFDocument.create();
    let worker = null;
    let tarefaPdf = null;
    let documentoPdf = null;
    let paginaAtual = 0;
    let totalPaginas = 1;
    let caracteresReconhecidos = 0;

    mostrarMensagemPdfLocal("OCR: preparando o modelo do idioma...", "");

    try {
        worker = await window.Tesseract.createWorker(idioma, 1, {
            logger: (evento) => atualizarProgressoOcrLocal(evento, paginaAtual, totalPaginas),
        });

        if (arquivoEhPdfLocal(arquivo)) {
            garantirBibliotecaCompactacaoVisualPdfLocal();
            tarefaPdf = window.pdfjsLib.getDocument({
                data: new Uint8Array(await arquivo.arrayBuffer()),
            });
            documentoPdf = await tarefaPdf.promise;
            totalPaginas = documentoPdf.numPages;

            for (paginaAtual = 1; paginaAtual <= totalPaginas; paginaAtual += 1) {
                mostrarMensagemPdfLocal(`OCR: reconhecendo página ${paginaAtual} de ${totalPaginas}...`, "");
                await aguardarProximoFramePdfLocal();

                const pagina = await documentoPdf.getPage(paginaAtual);
                let canvas = null;

                try {
                    canvas = await renderizarPaginaParaOcrLocal(pagina);
                    const resultado = await reconhecerPaginaPdfOcrLocal(worker, canvas);
                    caracteresReconhecidos += String(resultado.data.text || "").trim().length;
                    await adicionarPaginasPdfOcrLocal(pdfPesquisavel, resultado.data.pdf);
                } finally {
                    pagina.cleanup();

                    if (canvas) {
                        canvas.width = 1;
                        canvas.height = 1;
                    }
                }
            }
        } else {
            validarImagemParaOcrLocal(arquivo);
            paginaAtual = 1;

            const resultado = await reconhecerPaginaPdfOcrLocal(worker, arquivo);
            caracteresReconhecidos = String(resultado.data.text || "").trim().length;
            await adicionarPaginasPdfOcrLocal(pdfPesquisavel, resultado.data.pdf);
        }
    } finally {
        if (worker) {
            await worker.terminate();
        }

        if (documentoPdf) {
            await documentoPdf.destroy();
        } else if (tarefaPdf?.destroy) {
            await tarefaPdf.destroy();
        }
    }

    if (!caracteresReconhecidos) {
        throw new Error("Nenhum texto foi reconhecido neste arquivo.");
    }

    const bytes = await pdfPesquisavel.save({ useObjectStreams: true });
    const fileName = options.fileName || montarNomePdfProcessadoLocal(arquivo, "ocr");
    const unidade = totalPaginas === 1 ? "pagina reconhecida" : "paginas reconhecidas";
    const message = `OCR concluido: ${totalPaginas} ${unidade}. O PDF pesquisavel foi preparado.`;

    if (options.download === false) {
        return { bytes, fileName, message };
    }

    baixarBytesPdfLocal(bytes, fileName);
    return message;
}

function reconhecerPaginaPdfOcrLocal(worker, fonte) {
    return worker.recognize(
        fonte,
        { pdfTitle: "PDF pesquisável com OCR" },
        { pdf: true }
    );
}

async function adicionarPaginasPdfOcrLocal(pdfDestino, bytesPdfOcr) {
    if (!bytesPdfOcr) {
        throw new Error("Não foi possível criar a camada pesquisável desta página.");
    }

    const pdfOrigem = await window.PDFLib.PDFDocument.load(bytesPdfOcr);
    const paginas = await pdfDestino.copyPages(pdfOrigem, pdfOrigem.getPageIndices());
    paginas.forEach((pagina) => pdfDestino.addPage(pagina));
}

async function renderizarPaginaParaOcrLocal(pagina) {
    const nivel = PDF_LOCAL_OCR_RENDER_LEVELS[pdfLocalCompressionLevel.value]
        || PDF_LOCAL_OCR_RENDER_LEVELS.balanced;
    const escalaBase = nivel.scale;
    const dimensaoMaxima = nivel.maxDimension;
    let viewport = pagina.getViewport({ scale: escalaBase });
    const ajusteDimensao = Math.min(1, dimensaoMaxima / Math.max(viewport.width, viewport.height));

    if (ajusteDimensao < 1) {
        viewport = pagina.getViewport({ scale: escalaBase * ajusteDimensao });
    }

    const canvas = document.createElement("canvas");
    const contexto = canvas.getContext("2d", { alpha: false });

    if (!contexto) {
        throw new Error("Este navegador não conseguiu preparar uma página para OCR.");
    }

    canvas.width = Math.max(1, Math.ceil(viewport.width));
    canvas.height = Math.max(1, Math.ceil(viewport.height));
    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    await pagina.render({
        canvasContext: contexto,
        viewport,
        background: "#ffffff",
    }).promise;

    return canvas;
}

function atualizarProgressoOcrLocal(evento, paginaAtual, totalPaginas) {
    const progresso = Math.max(0, Math.min(100, Math.round(Number(evento?.progress || 0) * 100)));
    const status = String(evento?.status || "").toLowerCase();

    if (status === "recognizing text" && paginaAtual) {
        mostrarMensagemPdfLocal(`OCR: reconhecendo página ${paginaAtual} de ${totalPaginas} - ${progresso}%`, "");
        return;
    }

    if (progresso) {
        mostrarMensagemPdfLocal(`OCR: preparando modelo do idioma - ${progresso}%`, "");
    }
}

function arquivoEhPdfLocal(arquivo) {
    return arquivo.type === "application/pdf" || arquivo.name.toLowerCase().endsWith(".pdf");
}

function validarImagemParaOcrLocal(arquivo) {
    const nome = arquivo.name.toLowerCase();
    const extensaoValida = /\.(jpe?g|png|webp)$/.test(nome);
    const tipoValido = /^image\/(jpeg|png|webp)$/.test(arquivo.type);

    if (!extensaoValida && !tipoValido) {
        throw new Error("Escolha um arquivo PDF ou uma imagem JPG, PNG ou WEBP para usar o OCR.");
    }
}

function garantirBibliotecaOcrLocal() {
    if (!window.Tesseract?.createWorker || !window.PDFLib?.PDFDocument || typeof window.saveAs !== "function") {
        throw new Error("A biblioteca de OCR ainda não foi carregada. Verifique sua conexão e atualize a página.");
    }
}

async function converterImagensParaPdfLocal(arquivos) {
    const { PDFDocument } = window.PDFLib;
    const pdf = await PDFDocument.create();
    const margem = 24;

    for (const arquivo of arquivos) {
        const bytes = await arquivo.arrayBuffer();
        const extensao = arquivo.name.toLowerCase().split(".").pop();
        const imagem = extensao === "png"
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);
        const paisagem = imagem.width > imagem.height;
        const larguraPagina = paisagem ? 842 : 595;
        const alturaPagina = paisagem ? 595 : 842;
        const escala = Math.min(
            (larguraPagina - margem * 2) / imagem.width,
            (alturaPagina - margem * 2) / imagem.height
        );
        const largura = imagem.width * escala;
        const altura = imagem.height * escala;
        const pagina = pdf.addPage([larguraPagina, alturaPagina]);

        pagina.drawImage(imagem, {
            x: (larguraPagina - largura) / 2,
            y: (alturaPagina - altura) / 2,
            width: largura,
            height: altura,
        });
    }

    return baixarPdfLocal(pdf, "imagens-convertidas.pdf");
}

async function converterWordParaPdfLocal(arquivo) {
    if (!arquivo) {
        throw new Error("Escolha um arquivo Word .docx.");
    }

    const nome = String(arquivo.name || "").toLowerCase();

    if (!nome.endsWith(".docx")) {
        throw new Error("Esta ferramenta aceita apenas arquivos Word no formato .docx.");
    }

    mostrarMensagemPdfLocal("Lendo o arquivo Word...", "");
    const resultado = await window.mammoth.extractRawText({ arrayBuffer: await arquivo.arrayBuffer() });
    const texto = normalizarTextoWordParaPdfLocal(resultado.value || "");

    if (!texto.trim()) {
        throw new Error("Nao foi possivel encontrar texto neste arquivo Word.");
    }

    mostrarMensagemPdfLocal("Montando o PDF...", "");
    const pdf = await criarPdfTextoWordLocal(texto, arquivo.name.replace(/\.docx$/i, ""));
    const fileName = montarNomePdfProcessadoLocal(arquivo, "convertido");
    baixarBytesPdfLocal(await pdf.save({ useObjectStreams: true }), fileName);
    return `Word convertido para PDF. O download de ${fileName} foi iniciado.`;
}

async function criarPdfTextoWordLocal(texto, titulo) {
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const pdf = await PDFDocument.create();
    const fonte = await pdf.embedFont(StandardFonts.Helvetica);
    const fonteNegrito = await pdf.embedFont(StandardFonts.HelveticaBold);
    const larguraPagina = 595.28;
    const alturaPagina = 841.89;
    const margem = 54;
    const larguraTexto = larguraPagina - margem * 2;
    const tamanhoFonte = 11;
    const alturaLinha = 16;
    let pagina = pdf.addPage([larguraPagina, alturaPagina]);
    let y = alturaPagina - margem;

    const tituloLimpo = normalizarTextoPdfBasicoLocal(titulo || "Documento Word");
    pagina.drawText(tituloLimpo.slice(0, 90), {
        x: margem,
        y,
        size: 16,
        font: fonteNegrito,
        color: rgb(0.08, 0.12, 0.2),
    });
    y -= 28;

    const linhas = quebrarTextoPdfLocal(texto, fonte, tamanhoFonte, larguraTexto);

    for (const linha of linhas) {
        if (y < margem) {
            pagina = pdf.addPage([larguraPagina, alturaPagina]);
            y = alturaPagina - margem;
        }

        if (!linha) {
            y -= alturaLinha / 2;
            continue;
        }

        pagina.drawText(linha, {
            x: margem,
            y,
            size: tamanhoFonte,
            font: fonte,
            color: rgb(0.12, 0.16, 0.24),
        });
        y -= alturaLinha;
    }

    return pdf;
}

function quebrarTextoPdfLocal(texto, fonte, tamanhoFonte, larguraMaxima) {
    const linhas = [];
    const paragrafos = texto.split(/\n{2,}/);

    paragrafos.forEach((paragrafo) => {
        const textoParagrafo = paragrafo.replace(/\s+/g, " ").trim();

        if (!textoParagrafo) {
            linhas.push("");
            return;
        }

        let linha = "";
        textoParagrafo.split(" ").forEach((palavra) => {
            const tentativa = linha ? `${linha} ${palavra}` : palavra;

            if (fonte.widthOfTextAtSize(tentativa, tamanhoFonte) <= larguraMaxima) {
                linha = tentativa;
                return;
            }

            if (linha) {
                linhas.push(linha);
            }

            linha = palavra;

            while (fonte.widthOfTextAtSize(linha, tamanhoFonte) > larguraMaxima && linha.length > 8) {
                let corte = linha.length - 1;

                while (corte > 8 && fonte.widthOfTextAtSize(`${linha.slice(0, corte)}-`, tamanhoFonte) > larguraMaxima) {
                    corte -= 1;
                }

                linhas.push(`${linha.slice(0, corte)}-`);
                linha = linha.slice(corte);
            }
        });

        if (linha) {
            linhas.push(linha);
        }

        linhas.push("");
    });

    return linhas;
}

function normalizarTextoWordParaPdfLocal(texto) {
    return normalizarTextoPdfBasicoLocal(String(texto || ""))
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function normalizarTextoPdfBasicoLocal(texto) {
    return String(texto || "")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\u2022/g, "-")
        .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, " ");
}

function garantirBibliotecasWordParaPdfLocal() {
    garantirBibliotecaPdfLocal();

    if (!window.mammoth?.extractRawText) {
        throw new Error("A biblioteca Word para PDF ainda nao foi carregada. Verifique sua conexao e atualize a pagina.");
    }
}

async function criarPdfComPaginasLocais(pdf, indices, fileName) {
    return baixarPdfLocal(await copiarPaginasPdfLocais(pdf, indices), fileName);
}

async function copiarPaginasPdfLocais(pdf, indices) {
    const { PDFDocument } = window.PDFLib;
    const destino = await PDFDocument.create();
    const paginas = await destino.copyPages(pdf, indices);
    paginas.forEach((pagina) => destino.addPage(pagina));
    return destino;
}

function obterPaginasPdfLocais(pdf, options = {}) {
    const total = pdf.getPageCount();
    const texto = pdfLocalPages.value.trim();

    if (!texto) {
        if (options.required) {
            throw new Error("Informe as páginas desejadas. Exemplo: 1,3-5.");
        }

        return pdf.getPageIndices();
    }

    const paginas = [];

    texto.split(",").forEach((parte) => {
        const match = parte.trim().match(/^(\d+)(?:-(\d+))?$/);

        if (!match) {
            throw new Error("Use páginas no formato 1,3-5.");
        }

        const inicio = Number(match[1]);
        const fim = Number(match[2] || match[1]);
        const passo = fim >= inicio ? 1 : -1;

        for (let pagina = inicio; pagina !== fim + passo; pagina += passo) {
            if (pagina < 1 || pagina > total) {
                throw new Error(`A página ${pagina} não existe. Este PDF possui ${total} página${total === 1 ? "" : "s"}.`);
            }

            const indice = pagina - 1;

            if (options.allowRepeats || !paginas.includes(indice)) {
                paginas.push(indice);
            }
        }
    });

    return paginas;
}

async function carregarPdfLocal(arquivo) {
    try {
        return await window.PDFLib.PDFDocument.load(await arquivo.arrayBuffer());
    } catch (error) {
        throw new Error(`Não foi possível abrir ${arquivo.name}. Confira se o PDF não está protegido ou corrompido.`);
    }
}

async function baixarPdfLocal(pdf, fileName) {
    baixarBytesPdfLocal(await pdf.save({ useObjectStreams: true }), fileName);
}

function baixarBytesPdfLocal(bytes, fileName) {
    saveAs(new Blob([bytes], { type: "application/pdf" }), fileName);
}

function obterArquivosSelecionadosPdfLocal() {
    return pdfLocalSelectedFiles.length ? [...pdfLocalSelectedFiles] : Array.from(pdfLocalFiles.files);
}

function lidarMudancaArquivosPdfLocal() {
    const novos = Array.from(pdfLocalFiles.files || []);

    if (!novos.length) {
        atualizarPreVisualizacaoPdfLocal();
        return;
    }

    adicionarArquivosPdfLocal(novos);
}

function configurarArrastarSoltarPdfLocal() {
    if (!pdfLocalUploadDropzone || !pdfLocalFiles) {
        return;
    }

    ["dragenter", "dragover"].forEach((eventName) => {
        pdfLocalUploadDropzone.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            pdfLocalUploadDropzone.classList.add("is-dragover");
        });
    });

    ["dragleave", "dragend"].forEach((eventName) => {
        pdfLocalUploadDropzone.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!pdfLocalUploadDropzone.contains(event.relatedTarget)) {
                pdfLocalUploadDropzone.classList.remove("is-dragover");
            }
        });
    });

    pdfLocalUploadDropzone.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        pdfLocalUploadDropzone.classList.remove("is-dragover");

        const arquivos = Array.from(event.dataTransfer?.files || []);

        if (!arquivos.length) {
            return;
        }

        adicionarArquivosPdfLocal(arquivos);
    });
}

function adicionarArquivosPdfLocal(arquivos) {
    const config = PDF_LOCAL_OPERATIONS[pdfLocalOperation] || PDF_LOCAL_OPERATIONS.merge;
    const limiteOperacao = config.multiple ? PDF_LOCAL_MAX_FILES : 1;
    const arquivosAceitos = arquivos.filter((arquivo) => arquivoAceitoPdfLocal(arquivo, config));

    if (!arquivosAceitos.length) {
        mostrarMensagemPdfLocal("Esse tipo de arquivo não é aceito nesta ferramenta.", "error");
        atualizarPreVisualizacaoPdfLocal();
        return;
    }

    const mapa = new Map(config.multiple
        ? pdfLocalSelectedFiles.map((arquivo) => [obterChaveArquivoPdfLocal(arquivo), arquivo])
        : []);

    let excedeuLimite = false;

    arquivosAceitos.forEach((arquivo) => {
        if (mapa.size < limiteOperacao) {
            mapa.set(obterChaveArquivoPdfLocal(arquivo), arquivo);
            return;
        }

        excedeuLimite = true;
    });

    pdfLocalSelectedFiles = Array.from(mapa.values()).slice(0, limiteOperacao);
    sincronizarArquivosSelecionadosPdfLocal();
    atualizarPreVisualizacaoPdfLocal();
    limparMensagemPdfLocal();

    if (arquivosAceitos.length !== arquivos.length) {
        mostrarMensagemPdfLocal("Alguns arquivos foram ignorados porque não pertencem ao tipo desta ferramenta.", "error");
    } else if (excedeuLimite) {
        mostrarMensagemPdfLocal(config.multiple
            ? `Limite de ${PDF_LOCAL_MAX_FILES} arquivos por lote.`
            : "Esta ferramenta usa apenas um arquivo por vez.", "error");
    }
}

function arquivoAceitoPdfLocal(arquivo, config) {
    const regras = String(config.accept || "")
        .split(",")
        .map((regra) => regra.trim().toLowerCase())
        .filter(Boolean);

    if (!regras.length) {
        return true;
    }

    const nome = String(arquivo.name || "").toLowerCase();
    const tipo = String(arquivo.type || "").toLowerCase();

    return regras.some((regra) => {
        if (regra.startsWith(".")) {
            return nome.endsWith(regra);
        }

        if (regra.endsWith("/*")) {
            return tipo.startsWith(regra.slice(0, -1));
        }

        return tipo === regra;
    });
}

function obterChaveArquivoPdfLocal(arquivo) {
    return `${arquivo.name}|${arquivo.size}|${arquivo.lastModified}`;
}

function sincronizarArquivosSelecionadosPdfLocal() {
    if (typeof DataTransfer !== "function") {
        return;
    }

    const transfer = new DataTransfer();
    pdfLocalSelectedFiles.forEach((arquivo) => transfer.items.add(arquivo));
    pdfLocalFiles.files = transfer.files;
}

function atualizarPreVisualizacaoPdfLocal() {
    limparPreVisualizacaoPdfLocal();

    const arquivos = obterArquivosSelecionadosPdfLocal();
    const primeiroPdf = arquivos.find(arquivoEhPdfLocal);

    if (!primeiroPdf) {
        return;
    }

    pdfLocalPreviewUrl = URL.createObjectURL(primeiroPdf);
    pdfLocalPreviewInfo.textContent = arquivos.length > 1
        ? `${primeiroPdf.name} - ${formatarTamanhoArquivo(primeiroPdf.size)} - exibindo o primeiro PDF selecionado`
        : `${primeiroPdf.name} - ${formatarTamanhoArquivo(primeiroPdf.size)}`;
    pdfLocalPreviewOpen.href = pdfLocalPreviewUrl;
    pdfLocalPreviewFrame.src = pdfLocalPreviewUrl;
    pdfLocalPreview.classList.remove("is-hidden");
}

function limparPreVisualizacaoPdfLocal() {
    if (pdfLocalPreviewUrl) {
        URL.revokeObjectURL(pdfLocalPreviewUrl);
        pdfLocalPreviewUrl = "";
    }

    pdfLocalPreviewOpen.removeAttribute("href");
    pdfLocalPreviewFrame.removeAttribute("src");
    pdfLocalPreviewInfo.textContent = "";
    pdfLocalPreview.classList.add("is-hidden");
}

function formatarTamanhoArquivo(bytes) {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

function garantirBibliotecaPdfLocal() {
    if (!window.PDFLib?.PDFDocument || typeof window.saveAs !== "function") {
        throw new Error("As bibliotecas PDF ainda não foram carregadas. Verifique sua conexão e atualize a página.");
    }
}

function limparFormularioPdfLocal() {
    limparPreVisualizacaoPdfLocal();
    limparPainelLotePdfLocal();
    pdfLocalSelectedFiles = [];
    pdfLocalForm.reset();
    sincronizarArquivosSelecionadosPdfLocal();
    selecionarFerramentaPdfLocal("merge", { abrirPainel: false });
    mostrarHomeFerramentasPdfLocal();
    alternarCarregamentoPdfLocal(false);
}
function alternarCarregamentoPdfLocal(carregando) {
    pdfLocalSubmitButton.disabled = carregando;
    pdfLocalSubmitButton.textContent = carregando
        ? "Processando..."
        : PDF_LOCAL_OPERATIONS[pdfLocalOperation].buttonText;

    if (!carregando) {
        atualizarBotoesFerramentasPdf();
    }
}

function mostrarMensagemPdfLocal(texto, tipo) {
    pdfLocalMessage.textContent = texto;
    pdfLocalMessage.className = `message ${tipo || ""}`.trim();
}

function limparMensagemPdfLocal() {
    mostrarMensagemPdfLocal("", "");
}

function inicializarIcones() {
    if (window.lucide?.createIcons) {
        window.lucide.createIcons();
    }
}

function configurarExperienciaProduto() {
    configurarFavoritosNosCards();
    atualizarEstadoNotificacoes();

    notificationButton.addEventListener("click", () => {
        const abrindo = notificationPopover.classList.contains("is-hidden");
        notificationPopover.classList.toggle("is-hidden", !abrindo);
        notificationButton.setAttribute("aria-expanded", String(abrindo));

        if (abrindo) {
            localStorage.setItem(NOTIFICATIONS_READ_STORAGE_KEY, APP_VERSION);
            atualizarEstadoNotificacoes();
        }
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".notification-menu")) {
            notificationPopover.classList.add("is-hidden");
            notificationButton.setAttribute("aria-expanded", "false");
        }
    });

    openUpdatesHistoryButton.addEventListener("click", abrirHistoricoAtualizacoes);
    closeUpdatesHistoryButton.addEventListener("click", fecharHistoricoAtualizacoes);
    updatesModal.addEventListener("click", (event) => {
        if (event.target === updatesModal) {
            fecharHistoricoAtualizacoes();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !updatesModal.classList.contains("is-hidden")) {
            fecharHistoricoAtualizacoes();
        }
    });

    atualizarDashboardProduto();
}

function configurarFavoritosNosCards() {
    documentTypeButtons.forEach((card) => {
        const tipoDocumento = card.dataset.documentType;
        const wrapper = document.createElement("article");
        wrapper.className = "document-card-wrapper";
        wrapper.setAttribute("role", "listitem");
        card.removeAttribute("role");
        card.before(wrapper);
        wrapper.appendChild(card);

        if (tipoDocumento === "admin") {
            return;
        }

        wrapper.classList.add("has-favorite-action");
        const favorito = document.createElement("button");
        favorito.type = "button";
        favorito.className = "document-favorite-button";
        favorito.dataset.documentFavorite = tipoDocumento;
        favorito.setAttribute("aria-label", "Adicionar aos favoritos");
        favorito.innerHTML = '<i data-lucide="star" aria-hidden="true"></i>';
        favorito.addEventListener("click", () => alternarDocumentoFavorito(tipoDocumento));
        wrapper.appendChild(favorito);
    });
}

function abrirHistoricoAtualizacoes() {
    updatesModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    closeUpdatesHistoryButton.focus();
}

function fecharHistoricoAtualizacoes() {
    updatesModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
}

function atualizarEstadoNotificacoes() {
    const notificacoesLidas = localStorage.getItem(NOTIFICATIONS_READ_STORAGE_KEY) === APP_VERSION;
    notificationBadge.classList.toggle("is-hidden", notificacoesLidas);
}

function configurarTelaInicialDocumentos() {
    documentSearch.addEventListener("input", () => {
        if (documentSearch.value.trim()) {
            navegarTelaInicialDocumentos("documents", { focusSearch: false });
        }

        filtrarDocumentos();
    });

    documentFilterButtons.forEach((buttonFilter) => {
        buttonFilter.addEventListener("click", () => aplicarFiltroCategoriaDocumento(buttonFilter.dataset.documentFilter || "all"));
    });

    popularDocumentButtons.forEach((buttonShortcut) => {
        buttonShortcut.addEventListener("click", () => abrirTipoDocumento(buttonShortcut.dataset.documentShortcut));
    });

    homeNavigationButtons.forEach((buttonNav) => {
        buttonNav.addEventListener("click", () => navegarTelaInicialDocumentos(buttonNav.dataset.homeNav));
    });

    homeQuickActionButtons.forEach((buttonAction) => {
        buttonAction.addEventListener("click", () => {
            const action = buttonAction.dataset.homeAction;

            if (action === "documents") {
                navegarTelaInicialDocumentos("documents");
                return;
            }

            if (action === "pdf") {
                abrirTipoDocumento("pdf-local");
                return;
            }

            if (action === "billing") {
                abrirRenovacaoPlano();
                return;
            }

            if (action === "apk") {
                navegarTelaInicialDocumentos("apk");
            }
        });
    });

    homeCategoryShortcutButtons.forEach((buttonCategory) => {
        buttonCategory.addEventListener("click", () => {
            aplicarFiltroCategoriaDocumento(buttonCategory.dataset.documentCategoryShortcut || "all");
            navegarTelaInicialDocumentos("documents", { focusSearch: false });
        });
    });

    document.addEventListener("keydown", (event) => {
        const teclaBusca = (event.ctrlKey || event.metaKey) && String(event.key || "").toLowerCase() === "k";

        if (!teclaBusca || documentView.classList.contains("is-hidden")) {
            return;
        }

        event.preventDefault();
        navegarTelaInicialDocumentos("documents", { focusSearch: true });
    });

    filtrarDocumentos();
}

function aplicarFiltroCategoriaDocumento(categoria) {
    documentCategoryFilter = categoria || "all";

    documentFilterButtons.forEach((button) => {
        const ativo = button.dataset.documentFilter === documentCategoryFilter;
        button.classList.toggle("is-active", ativo);
        button.setAttribute("aria-selected", String(ativo));
    });

    if (documentSearch) {
        documentSearch.value = "";
    }

    filtrarDocumentos();
}

function filtrarDocumentos() {
    const busca = normalizarTextoBusca(documentSearch.value);
    const favoritos = lerListaArmazenada(FAVORITES_STORAGE_KEY);
    let totalVisivel = 0;

    documentTypeButtons.forEach((card) => {
        const categorias = String(card.dataset.documentCategory || "").split(" ");
        const correspondeCategoria = documentCategoryFilter === "all" || categorias.includes(documentCategoryFilter);
        const correspondeBusca = !busca || normalizarTextoBusca(card.textContent).includes(busca);
        const correspondeFavoritos = card.dataset.documentType === "admin" || !favoritos.includes(card.dataset.documentType);
        const correspondePermissao = usuarioPodeAcessarDocumento(card.dataset.documentType);
        const corresponde = correspondeCategoria && correspondeBusca && correspondeFavoritos && correspondePermissao;

        const wrapper = card.closest(".document-card-wrapper") || card;
        wrapper.classList.toggle("is-filtered-out", !corresponde);
        wrapper.classList.toggle("contains-hidden-card", card.classList.contains("is-hidden"));

        if (corresponde && !card.classList.contains("is-hidden")) {
            totalVisivel += 1;
        }
    });

    documentEmptyState.classList.toggle("is-hidden", totalVisivel > 0);
}

function normalizarTextoBusca(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function obterChaveArmazenamento(chaveBase) {
    const identificador = usuarioAtual?.id || usuarioAtual?.email || "visitante";
    return `${chaveBase}:${identificador}`;
}

function lerListaArmazenada(chaveBase) {
    try {
        const valor = JSON.parse(localStorage.getItem(obterChaveArmazenamento(chaveBase)) || "[]");
        return Array.isArray(valor) ? valor : [];
    } catch (error) {
        return [];
    }
}

function salvarListaArmazenada(chaveBase, lista) {
    localStorage.setItem(obterChaveArmazenamento(chaveBase), JSON.stringify(lista));
}

function obterTotalDocumentosGerados() {
    return Math.max(0, Number(localStorage.getItem(obterChaveArmazenamento(GENERATED_COUNT_STORAGE_KEY)) || 0));
}

function registrarDocumentoGerado() {
    const novoTotal = obterTotalDocumentosGerados() + 1;
    localStorage.setItem(obterChaveArmazenamento(GENERATED_COUNT_STORAGE_KEY), String(novoTotal));
    atualizarDashboardProduto();
}

async function registrarUsoDocumentoNoServidor(tipoDocumento) {
    const data = await apiRequest("/api/documents/usage", {
        method: "POST",
        body: { documentType: tipoDocumento },
    });
    aplicarUsoDiarioDocumentos(data.documentUsage);
}

async function registrarUsoFerramentaPdfNoServidor(toolType) {
    const data = await apiRequest("/api/pdf-tools/usage", {
        method: "POST",
        body: { toolType },
    });
    aplicarUsoFerramentasPdf(data.pdfToolUsage);
}

function aplicarUsoDiarioDocumentos(usage) {
    documentUsage = usage && typeof usage === "object"
        ? usage
        : { unlimited: true, limit: null, documents: {} };
    atualizarCardsUsoDiario();
    atualizarDashboardProduto();
    agendarAtualizacaoUsoDiario();
}

function aplicarUsoFerramentasPdf(usage) {
    pdfToolUsage = usage && typeof usage === "object"
        ? usage
        : { allowed: false, unlimited: false, tools: {} };
    atualizarCartaoPdfLocal();
    atualizarBotoesFerramentasPdf();
    atualizarDashboardProduto();
}

function configurarAtualizacaoAutomaticaUsoDiario() {
    window.addEventListener("focus", () => {
        carregarUsoDiarioDocumentos();
        carregarUsoFerramentasPdf();
    });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            carregarUsoDiarioDocumentos();
            carregarUsoFerramentasPdf();
        }
    });
}

async function carregarUsoDiarioDocumentos() {
    if (!usuarioAtual) {
        return;
    }

    try {
        const data = await apiRequest("/api/documents/usage");
        aplicarUsoDiarioDocumentos(data.documentUsage);
    } catch (error) {
        console.warn("Nao foi possivel atualizar os limites diarios.", error);
    }
}

async function carregarUsoFerramentasPdf() {
    if (!usuarioAtual) {
        return;
    }

    try {
        const data = await apiRequest("/api/pdf-tools/usage");
        aplicarUsoFerramentasPdf(data.pdfToolUsage);
    } catch (error) {
        console.warn("Nao foi possivel atualizar os limites das ferramentas PDF.", error);
    }
}

function agendarAtualizacaoUsoDiario() {
    cancelarAtualizacaoUsoDiario();

    if (!usuarioAtual || documentUsage.unlimited || !documentUsage.nextResetAt) {
        return;
    }

    const nextReset = new Date(documentUsage.nextResetAt).getTime();
    const delay = nextReset - Date.now() + 2500;

    if (!Number.isFinite(nextReset)) {
        return;
    }

    dailyUsageRefreshTimer = window.setTimeout(() => {
        carregarUsoDiarioDocumentos();
    }, Math.max(5000, delay));
}

function cancelarAtualizacaoUsoDiario() {
    if (dailyUsageRefreshTimer) {
        window.clearTimeout(dailyUsageRefreshTimer);
        dailyUsageRefreshTimer = null;
    }
}

function obterHorarioResetUsoDiario() {
    if (documentUsage.nextResetAt) {
        const dataReset = new Date(documentUsage.nextResetAt);

        if (Number.isFinite(dataReset.getTime())) {
            return new Intl.DateTimeFormat("pt-BR", {
                timeZone: "America/Bahia",
                hour: "2-digit",
                minute: "2-digit",
            }).format(dataReset);
        }
    }

    const hora = Number(documentUsage.resetHour ?? 4);
    const minuto = Number(documentUsage.resetMinute ?? 0);
    return `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
}

function atualizarCardsUsoDiario() {
    documentTypeButtons.forEach((card) => {
        const tipoDocumento = card.dataset.documentType;

        if (!DAILY_LIMIT_DOCUMENT_TYPES.has(tipoDocumento)) {
            return;
        }

        const status = card.querySelector(".document-status");

        if (!status) {
            return;
        }

        const quota = documentUsage.documents?.[tipoDocumento];
        const bloqueado = !documentUsage.unlimited && Number(quota?.remaining ?? documentUsage.limit ?? 0) <= 0;
        const restante = Math.max(0, Number(quota?.remaining ?? documentUsage.limit ?? 0));
        const horarioReset = obterHorarioResetUsoDiario();
        card.classList.toggle("document-quota-blocked", bloqueado);
        card.setAttribute("aria-disabled", String(bloqueado));
        card.title = bloqueado
            ? `Sem saldo disponível. A renovação diária adiciona saldo às ${horarioReset}.`
            : "";
        status.innerHTML = documentUsage.unlimited
            ? '<i data-lucide="check" aria-hidden="true"></i> Disponível'
            : bloqueado
                ? '<i data-lucide="lock" aria-hidden="true"></i> Bloqueado'
                : `<i data-lucide="check" aria-hidden="true"></i> Disponível ${restante}`;
    });

    inicializarIcones();
}

function documentoEstaDisponivel(tipoDocumento) {
    if (!usuarioPodeAcessarDocumento(tipoDocumento)) {
        return false;
    }

    if (!DAILY_LIMIT_DOCUMENT_TYPES.has(tipoDocumento) || documentUsage.unlimited) {
        return true;
    }

    const quota = documentUsage.documents?.[tipoDocumento];
    return Number(quota?.remaining ?? documentUsage.limit ?? 0) > 0;
}

function informarLimiteDocumento(tipoDocumento) {
    if (!usuarioPodeAcessarDocumento(tipoDocumento)) {
        const texto = `O documento "${obterTituloDocumento(tipoDocumento)}" não está liberado para este login.`;
        mostrarMensagemAcesso(texto, "error");
        window.alert(texto);
        return;
    }

    const texto = documentUsage.renewalEnabled === false
        ? `Você atingiu o saldo disponível para ${obterTituloDocumento(tipoDocumento)}. A renovação diária está desligada para este login.`
        : `Você atingiu o saldo disponível para ${obterTituloDocumento(tipoDocumento)}. A renovação diária adiciona +${documentUsage.dailyAdd || documentUsage.limit || 5} às ${obterHorarioResetUsoDiario()}.`;
    mostrarMensagemAcesso(texto, "error");
    window.alert(texto);
}

function registrarDocumentoRecente(tipoDocumento) {
    if (!tipoDocumento || tipoDocumento === "admin") {
        return;
    }

    const recentes = lerListaArmazenada(RECENTS_STORAGE_KEY).filter((tipo) => tipo !== tipoDocumento);
    salvarListaArmazenada(RECENTS_STORAGE_KEY, [tipoDocumento, ...recentes].slice(0, 10));
    atualizarDashboardProduto();
}

function alternarDocumentoFavorito(tipoDocumento) {
    const favoritos = lerListaArmazenada(FAVORITES_STORAGE_KEY);
    const removendo = favoritos.includes(tipoDocumento);
    const novoFavoritos = removendo
        ? favoritos.filter((tipo) => tipo !== tipoDocumento)
        : [tipoDocumento, ...favoritos];

    salvarListaArmazenada(FAVORITES_STORAGE_KEY, novoFavoritos);

    if (!removendo) {
        const recentes = lerListaArmazenada(RECENTS_STORAGE_KEY).filter((tipo) => tipo !== tipoDocumento);
        salvarListaArmazenada(RECENTS_STORAGE_KEY, recentes);
    }

    atualizarDashboardProduto();
    filtrarDocumentos();
}

function obterIconeDocumento(tipoDocumento) {
    const icones = {
        comodato: "file-text",
        "ufba-membros": "users",
        "renda-membros": "landmark",
        posse: "sprout",
        "autodeclaracao-rural": "wheat",
        "procuracao-consumidor": "key-round",
        "procuracao-normal": "key-round",
        "contrato-honorarios-50": "briefcase",
        "contrato-prev-40": "file-text",
        "contrato-prev-30": "file-text",
        "contrato-compra-venda-imovel": "file-text",
        "contrato-compra-venda-veiculo": "file-text",
        "cadastro-confrontantes": "map",
        "controle-producao-anual": "chart-column",
        "controle-rebanho": "clipboard-list",
        "inventario-producao-rural": "package",
        "contrato-arrendamento-rural": "file-text",
        "contrato-comodato-equipamentos": "wrench",
        "contrato-parceria-rural": "handshake",
        "declaracao-posse-mansa-pacifica": "sprout",
        "declaracao-residencia": "house",
        "declaracao-nao-possuir-renda": "wallet",
        "declaracao-agricultura-familiar": "wheat",
        "declaracao-dependencia-economica": "users",
        "declaracao-convivencia-familiar": "heart-handshake",
        "declaracao-baixa-renda": "badge-dollar-sign",
        "declaracao-autenticidade-documentos": "badge-check",
        "declaracao-atividade-rural": "wheat",
        "declaracao-uniao-estavel": "heart",
        "declaracao-tempo-trabalho-rural": "clock",
        "pdf-local": "settings",
    };

    return icones[tipoDocumento] || "file-text";
}

function obterTituloDocumento(tipoDocumento) {
    const card = documentTypeButtons.find((item) => item.dataset.documentType === tipoDocumento);
    return card?.querySelector(".document-card-copy strong")?.textContent || tipoDocumento;
}

function obterTiposDocumentosControlaveis() {
    return documentTypeButtons
        .filter((card) => card.dataset.documentType && card.dataset.documentType !== "admin")
        .map((card) => ({
            id: card.dataset.documentType,
            title: obterTituloDocumento(card.dataset.documentType),
            category: String(card.dataset.documentCategory || "").split(/\s+/)[0] || "document",
        }));
}

function normalizarListaDocumentosLiberados(lista) {
    if (!Array.isArray(lista)) {
        return [];
    }

    const tiposValidos = new Set(obterTiposDocumentosControlaveis().map((documento) => documento.id));
    return [...new Set(lista.map((tipo) => String(tipo || "").trim()).filter((tipo) => tiposValidos.has(tipo)))];
}

function usuarioPodeAcessarDocumento(tipoDocumento) {
    if (!tipoDocumento || tipoDocumento === "admin") {
        return usuarioAtualEhAdmin || tipoDocumento !== "admin";
    }

    if (usuarioAtualEhAdmin) {
        return true;
    }

    if (tipoDocumento === "pdf-local") {
        return usuarioPodeUsarFerramentasPdf();
    }

    const documentosLiberados = normalizarListaDocumentosLiberados(usuarioAtual?.allowedDocumentTypes);
    return documentosLiberados.length === 0 || documentosLiberados.includes(tipoDocumento);
}

function usuarioPodeUsarFerramentasPdf() {
    if (!usuarioAtual) {
        return false;
    }

    if (usuarioAtualEhAdmin) {
        return true;
    }

    const documentosLiberados = normalizarListaDocumentosLiberados(usuarioAtual.allowedDocumentTypes);
    const documentoPdfLiberado = documentosLiberados.length === 0 || documentosLiberados.includes("pdf-local");
    return Boolean(usuarioAtual.allowPdfTools) && documentoPdfLiberado;
}

function configurarControleDocumentosAdmin() {
    if (!adminDocumentAccessList || !adminAllowAllDocuments) {
        return;
    }

    adminDocumentAccessList.textContent = "";

    obterTiposDocumentosControlaveis().forEach((documento) => {
        const label = document.createElement("label");
        label.className = "admin-document-access-option";
        label.innerHTML = `
            <input type="checkbox" value="${escaparHtmlSeguro(documento.id)}" data-admin-document-access>
            <span>${escaparHtmlSeguro(documento.title)}</span>
        `;
        adminDocumentAccessList.appendChild(label);
    });

    adminAllowAllDocuments.addEventListener("change", atualizarEstadoControleDocumentosAdmin);
    atualizarEstadoControleDocumentosAdmin();
}

function atualizarEstadoControleDocumentosAdmin() {
    const liberarTodos = adminAllowAllDocuments?.checked;
    adminDocumentAccessList?.querySelectorAll("[data-admin-document-access]").forEach((checkbox) => {
        checkbox.disabled = liberarTodos;

        if (liberarTodos) {
            checkbox.checked = true;
        }
    });
}

function obterDocumentosLiberadosAdmin() {
    if (adminAllowAllDocuments?.checked) {
        return [];
    }

    return Array.from(adminDocumentAccessList?.querySelectorAll("[data-admin-document-access]:checked") || [])
        .map((checkbox) => checkbox.value);
}

function aplicarDocumentosLiberadosAdmin(lista) {
    const documentosLiberados = normalizarListaDocumentosLiberados(lista);
    const liberarTodos = documentosLiberados.length === 0;

    if (adminAllowAllDocuments) {
        adminAllowAllDocuments.checked = liberarTodos;
    }

    adminDocumentAccessList?.querySelectorAll("[data-admin-document-access]").forEach((checkbox) => {
        checkbox.checked = liberarTodos || documentosLiberados.includes(checkbox.value);
    });

    atualizarEstadoControleDocumentosAdmin();
}

function configurarControleSaldoAdmin() {
    if (!adminUserQuotaDocument) {
        return;
    }

    adminUserQuotaDocument.textContent = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Escolha um documento";
    adminUserQuotaDocument.appendChild(placeholder);

    obterTiposDocumentosControlaveis()
        .filter((documento) => DAILY_LIMIT_DOCUMENT_TYPES.has(documento.id))
        .forEach((documento) => {
            const option = document.createElement("option");
            option.value = documento.id;
            option.textContent = documento.title;
            adminUserQuotaDocument.appendChild(option);
        });

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "Todos os documentos";
    adminUserQuotaDocument.appendChild(allOption);
}

function configurarControlePdfAdmin() {
    if (!adminUserPdfToolOperation) {
        return;
    }

    adminUserPdfToolOperation.textContent = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Escolha uma ferramenta PDF";
    adminUserPdfToolOperation.appendChild(placeholder);

    Object.keys(PDF_LOCAL_OPERATIONS).forEach((toolType) => {
        const option = document.createElement("option");
        option.value = toolType;
        option.textContent = obterTituloFerramentaPdf(toolType);
        adminUserPdfToolOperation.appendChild(option);
    });

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "Todas as ferramentas PDF";
    adminUserPdfToolOperation.appendChild(allOption);
}

function obterTituloFerramentaPdf(toolType) {
    const config = PDF_LOCAL_OPERATIONS[toolType];

    if (!config) {
        return toolType === "all" ? "todas as ferramentas PDF" : toolType;
    }

    return config.buttonText || toolType;
}

function criarAtalhoDocumento(tipoDocumento, options = {}) {
    const buttonAtalho = document.createElement("button");
    buttonAtalho.type = "button";
    buttonAtalho.className = "dashboard-document-item";
    buttonAtalho.innerHTML = `
        <span class="dashboard-document-item-icon"><i data-lucide="${obterIconeDocumento(tipoDocumento)}" aria-hidden="true"></i></span>
        <span>
            <span class="dashboard-document-item-title">${escaparHtmlSeguro(obterTituloDocumento(tipoDocumento))}</span>
            <span class="dashboard-document-item-meta">
                <span>${tipoDocumento === "pdf-local" ? "Ferramenta disponível" : "Editado recentemente"}</span>
                <span class="dashboard-document-item-type">${tipoDocumento === "pdf-local" ? "PDF" : "DOCX"}</span>
            </span>
        </span>
        <i data-lucide="chevron-right" aria-hidden="true"></i>
    `;
    buttonAtalho.addEventListener("click", () => abrirTipoDocumento(tipoDocumento));

    if (!options.allowRemoveFavorite) {
        return buttonAtalho;
    }

    const item = document.createElement("div");
    item.className = "dashboard-document-favorite-item";
    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "dashboard-document-favorite-remove";
    remover.setAttribute("aria-label", `Remover ${obterTituloDocumento(tipoDocumento)} dos favoritos`);
    remover.innerHTML = '<i data-lucide="star" aria-hidden="true"></i>';
    remover.addEventListener("click", () => alternarDocumentoFavorito(tipoDocumento));
    item.append(buttonAtalho, remover);
    return item;
}

function renderizarAtalhosDocumentos(container, documentos, mensagemVazia, options = {}) {
    container.textContent = "";

    if (documentos.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "dashboard-document-empty";
        vazio.textContent = mensagemVazia;
        container.appendChild(vazio);
        return;
    }

    documentos.forEach((tipoDocumento) => {
        if (documentTypeButtons.some((item) => item.dataset.documentType === tipoDocumento) && usuarioPodeAcessarDocumento(tipoDocumento)) {
            container.appendChild(criarAtalhoDocumento(tipoDocumento, options));
        }
    });
}

function definirTextoElemento(elemento, valor) {
    if (elemento) {
        elemento.textContent = String(valor);
    }
}

function calcularSaldoDocumentosHome() {
    if (usuarioAtualEhAdmin || documentUsage?.unlimited) {
        return "∞";
    }

    const saldos = Object.values(documentUsage?.documents || {})
        .map((quota) => Number(quota?.remaining ?? documentUsage?.limit ?? 0))
        .filter((valor) => Number.isFinite(valor));

    return Math.max(0, ...saldos, Number(documentUsage?.limit ?? 0));
}

function calcularSaldoPdfHome() {
    if (!usuarioPodeUsarFerramentasPdf()) {
        return 0;
    }

    if (usuarioAtualEhAdmin || pdfToolUsage?.unlimited) {
        return "∞";
    }

    const saldos = Object.values(pdfToolUsage?.tools || {})
        .map((quota) => Number(quota?.remaining ?? pdfToolUsage?.limit ?? 0))
        .filter((valor) => Number.isFinite(valor));

    return Math.max(0, ...saldos, Number(pdfToolUsage?.limit ?? 0));
}

function atualizarDashboardProduto() {
    const favoritos = lerListaArmazenada(FAVORITES_STORAGE_KEY);
    const recentes = lerListaArmazenada(RECENTS_STORAGE_KEY);
    const favoritosLiberados = favoritos.filter(usuarioPodeAcessarDocumento);
    const recentesLiberados = recentes.filter(usuarioPodeAcessarDocumento);
    const totalGerados = obterTotalDocumentosGerados();
    const totalModelos = documentTypeButtons.filter((card) => card.dataset.documentType !== "admin" && usuarioPodeAcessarDocumento(card.dataset.documentType)).length;

    definirTextoElemento(documentGeneratedCount, totalGerados);
    definirTextoElemento(documentFavoriteCount, favoritosLiberados.length);
    definirTextoElemento(documentModelCount, totalModelos);
    definirTextoElemento(homeDocumentBalanceCount, calcularSaldoDocumentosHome());
    definirTextoElemento(homePdfBalanceCount, calcularSaldoPdfHome());
    definirTextoElemento(homeFavoriteCount, favoritosLiberados.length);
    definirTextoElemento(homeRecentCount, recentesLiberados.length);

    renderizarAtalhosDocumentos(recentDocumentsList, recentesLiberados.filter((tipo) => !favoritosLiberados.includes(tipo)).slice(0, 3), "Seus documentos recentes aparecerão aqui.");
    renderizarAtalhosDocumentos(favoriteDocumentsList, favoritosLiberados, "Marque a estrela de um documento para encontrá-lo rapidamente.", { allowRemoveFavorite: true });

    popularDocumentButtons.forEach((buttonShortcut) => {
        buttonShortcut.classList.toggle("is-hidden", favoritos.includes(buttonShortcut.dataset.documentShortcut) || !usuarioPodeAcessarDocumento(buttonShortcut.dataset.documentShortcut));
    });

    if (popularDocumentButtons.length) {
        popularDocumentsSection.classList.toggle("is-hidden", popularDocumentButtons.every((buttonShortcut) => buttonShortcut.classList.contains("is-hidden")));
    } else {
        popularDocumentsSection.classList.remove("is-hidden");
    }

    document.querySelectorAll("[data-document-favorite]").forEach((buttonFavorito) => {
        const ativo = favoritos.includes(buttonFavorito.dataset.documentFavorite);
        buttonFavorito.classList.toggle("is-favorite", ativo);
        buttonFavorito.setAttribute("aria-pressed", String(ativo));
        buttonFavorito.setAttribute("aria-label", ativo ? "Remover dos favoritos" : "Adicionar aos favoritos");
    });

    atualizarPerfilProduto();
    inicializarIcones();
}

function atualizarPerfilProduto() {
    const primeiroNome = String(usuarioAtual?.name || "Usuário").trim();
    const planId = normalizePlanId(usuarioAtual?.plan);

    profileUserName.textContent = primeiroNome || "Usuário";
    atualizarSeloAoLadoDoNome(profileUserName, usuarioAtual);
    profileUserEmail.textContent = usuarioAtual?.email || "";
    profilePlanName.textContent = usuarioAtual?.isAdmin
        ? "Acesso administrativo"
        : planId === "proMax365"
            ? "Plano Pro Max"
            : planId === "test3min" ? "Teste de 3 minutos" : "Plano Básico";
    profileExpiration.textContent = usuarioAtual?.isAdmin
        ? "Acesso contínuo"
        : usuarioAtual?.expiresAt ? formatarVencimento(usuarioAtual) : "Não informada";
    renderizarFotoPerfil(usuarioAtual);
    atualizarPainelTemaLiquidGlass();
}


function obterTemaSistemaSalvo() {
    return localStorage.getItem(SYSTEM_THEME_STORAGE_KEY) === "light" ? "light" : "dark";
}

function aplicarTemaSistema(theme) {
    const tema = theme === "light" ? "light" : "dark";
    document.body.classList.toggle("system-light-theme", tema === "light");
    document.body.classList.toggle("system-dark-theme", tema !== "light");
    document.documentElement.style.colorScheme = tema === "light" ? "light" : "dark";
}

function atualizarControlesTemaSistema() {
    const tema = obterTemaSistemaSalvo();
    const claro = tema === "light";

    aplicarTemaSistema(tema);

    if (systemThemeSelect) {
        systemThemeSelect.value = tema;
    }

    systemThemeToggleButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(claro));
        const label = button.querySelector("span");
        const icon = button.querySelector("i");

        if (label) {
            label.textContent = claro ? "Tema azul" : "Tema branco";
        }

        if (icon) {
            icon.setAttribute("data-lucide", claro ? "moon" : "sun");
        }
    });

    inicializarIcones();
}

function definirTemaSistema(theme) {
    const tema = theme === "light" ? "light" : "dark";
    localStorage.setItem(SYSTEM_THEME_STORAGE_KEY, tema);
    atualizarControlesTemaSistema();
}

function alternarTemaSistema() {
    definirTemaSistema(obterTemaSistemaSalvo() === "light" ? "dark" : "light");
}

function configurarTemaSistema() {
    aplicarTemaSistema(obterTemaSistemaSalvo());

    systemThemeSelect?.addEventListener("change", () => definirTemaSistema(systemThemeSelect.value));
    systemThemeToggleButtons.forEach((button) => {
        button.addEventListener("click", alternarTemaSistema);
    });

    atualizarControlesTemaSistema();
}

function configurarTemaLiquidGlass() {
    if (localStorage.getItem(LIQUID_GLASS_THEME_LAST_STATE_KEY) === "yes") {
        aplicarTemaLiquidGlass(true);
    }

    configurarMovimentoLiquidGlass();
    toggleLiquidGlassThemeButton?.addEventListener("click", alternarTemaLiquidGlass);
    atualizarPainelTemaLiquidGlass();
}

function configurarMovimentoLiquidGlass() {
    if (document.body.dataset.liquidGlassPointer === "true") {
        return;
    }

    document.body.dataset.liquidGlassPointer = "true";
    document.documentElement.style.setProperty("--liquid-pointer-x", "54%");
    document.documentElement.style.setProperty("--liquid-pointer-y", "18%");
}

function usuarioPodeUsarTemaLiquidGlass() {
    return Boolean(usuarioAtual?.allowLiquidGlass || usuarioAtual?.isAdmin);
}

function obterChaveTemaLiquidGlass() {
    return `${LIQUID_GLASS_THEME_STORAGE_KEY}_${usuarioAtual?.id || "anon"}`;
}

function temaLiquidGlassAtivo() {
    if (!usuarioAtual?.id) {
        return localStorage.getItem(LIQUID_GLASS_THEME_LAST_STATE_KEY) === "yes";
    }

    return usuarioPodeUsarTemaLiquidGlass()
        && localStorage.getItem(obterChaveTemaLiquidGlass()) === "yes";
}

function aplicarTemaLiquidGlass(ativo) {
    document.body.classList.toggle("liquid-glass-theme", Boolean(ativo));
}

function atualizarPainelTemaLiquidGlass() {
    const permitido = usuarioPodeUsarTemaLiquidGlass();
    const ativo = temaLiquidGlassAtivo();

    profileThemePanel?.classList.toggle("is-hidden", !permitido);
    aplicarTemaLiquidGlass(!usuarioAtual?.id || permitido ? ativo : false);

    if (!toggleLiquidGlassThemeButton) {
        return;
    }

    toggleLiquidGlassThemeButton.setAttribute("aria-pressed", String(ativo));
    toggleLiquidGlassThemeButton.querySelector("span").textContent = ativo
        ? "Desativar tema"
        : "Ativar tema";
}

function alternarTemaLiquidGlass() {
    if (!usuarioPodeUsarTemaLiquidGlass()) {
        aplicarTemaLiquidGlass(false);
        return;
    }

    const proximoEstado = !temaLiquidGlassAtivo();
    localStorage.setItem(obterChaveTemaLiquidGlass(), proximoEstado ? "yes" : "no");
    localStorage.setItem(LIQUID_GLASS_THEME_LAST_STATE_KEY, proximoEstado ? "yes" : "no");
    atualizarPainelTemaLiquidGlass();
}

function navegarTelaInicialDocumentos(destino, options = {}) {
    const destinoValido = ["home", "favorites", "documents", "apk", "profile"].includes(destino) ? destino : "home";
    documentView.classList.toggle("is-profile-page", destinoValido === "profile");

    homeNavigationButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.homeNav === destinoValido);
    });

    homeSections.forEach((section) => {
        const exibirCatalogo = section === documentCatalogSection && destinoValido === "documents";
        section.classList.toggle("is-hidden", !exibirCatalogo && section.dataset.homeSection !== destinoValido);
    });

    atualizarDashboardProduto();

    if (destinoValido === "apk") {
        carregarAppReleaseUsuario();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (destinoValido === "documents" && options.focusSearch !== false) {
        window.setTimeout(() => documentSearch.focus({ preventScroll: true }), 250);
    }
}

function configurarFotoPerfil() {
    profileAvatarOpenButton.addEventListener("click", abrirPopupFotoPerfil);
    profileAvatarCloseButton.addEventListener("click", fecharPopupFotoPerfil);
    profileAvatarModal.addEventListener("click", (event) => {
        if (event.target === profileAvatarModal) {
            fecharPopupFotoPerfil();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !profileAvatarModal.classList.contains("is-hidden")) {
            fecharPopupFotoPerfil();
        }
    });

    profileAvatarChangeButton.addEventListener("click", () => {
        profileAvatarFile.value = "";
        profileAvatarFile.click();
    });

    profileAvatarFile.addEventListener("change", async () => {
        const arquivo = profileAvatarFile.files?.[0];

        if (!arquivo) {
            return;
        }

        alternarCarregamentoFotoPerfil(true);
        mostrarMensagemFotoPerfil("Preparando foto...");

        try {
            const avatarDataUrl = await compactarFotoPerfil(arquivo);
            await salvarFotoPerfil(avatarDataUrl);
        } catch (error) {
            console.error(error);
            mostrarMensagemFotoPerfil(traduzirErroApi(error), "error");
        } finally {
            alternarCarregamentoFotoPerfil(false);
        }
    });

    profileAvatarRemoveButton.addEventListener("click", async () => {
        alternarCarregamentoFotoPerfil(true);

        try {
            await salvarFotoPerfil("");
        } catch (error) {
            console.error(error);
            mostrarMensagemFotoPerfil(traduzirErroApi(error), "error");
        } finally {
            alternarCarregamentoFotoPerfil(false);
        }
    });
}

function abrirPopupFotoPerfil() {
    mostrarMensagemFotoPerfil("");
    profileAvatarModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    profileAvatarCloseButton.focus();
}

function fecharPopupFotoPerfil() {
    profileAvatarModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
    profileAvatarOpenButton.focus();
}

async function salvarFotoPerfil(avatarDataUrl) {
    const data = await apiRequest("/api/profile/avatar", {
        method: "PUT",
        body: { avatarDataUrl },
    });

    usuarioAtual = data.user;
    atualizarUsuario(usuarioAtual);
    mostrarMensagemFotoPerfil(data.message || "Foto de perfil atualizada.", "success");
}

async function compactarFotoPerfil(arquivo) {
    const tiposPermitidos = new Set(["image/jpeg", "image/png", "image/webp"]);

    if (!tiposPermitidos.has(arquivo.type)) {
        throw new Error("Escolha uma foto JPG, PNG ou WEBP.");
    }

    if (arquivo.size > PROFILE_PHOTO_MAX_SOURCE_BYTES) {
        throw new Error("Escolha uma foto de ate 5 MB.");
    }

    const imagem = await carregarImagemLocal(arquivo);
    const tamanhoOrigem = Math.min(imagem.naturalWidth, imagem.naturalHeight);
    const canvas = document.createElement("canvas");
    const contexto = canvas.getContext("2d");
    const tamanhoFinal = 320;

    if (!tamanhoOrigem || !contexto) {
        throw new Error("Nao foi possivel processar essa foto.");
    }

    canvas.width = tamanhoFinal;
    canvas.height = tamanhoFinal;
    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, tamanhoFinal, tamanhoFinal);
    contexto.drawImage(
        imagem,
        (imagem.naturalWidth - tamanhoOrigem) / 2,
        (imagem.naturalHeight - tamanhoOrigem) / 2,
        tamanhoOrigem,
        tamanhoOrigem,
        0,
        0,
        tamanhoFinal,
        tamanhoFinal
    );

    let qualidade = 0.86;
    let dataUrl = canvas.toDataURL("image/jpeg", qualidade);

    while (dataUrl.length > PROFILE_PHOTO_MAX_DATA_URL_LENGTH && qualidade > 0.5) {
        qualidade -= 0.08;
        dataUrl = canvas.toDataURL("image/jpeg", qualidade);
    }

    if (dataUrl.length > PROFILE_PHOTO_MAX_DATA_URL_LENGTH) {
        throw new Error("A foto ficou muito grande. Escolha outra imagem.");
    }

    return dataUrl;
}

function carregarImagemLocal(arquivo) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();
        const url = URL.createObjectURL(arquivo);

        imagem.onload = () => {
            URL.revokeObjectURL(url);
            resolve(imagem);
        };
        imagem.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Nao foi possivel abrir essa foto."));
        };
        imagem.src = url;
    });
}

function renderizarFotoPerfil(user) {
    const avatarDataUrl = String(user?.avatarDataUrl || "");
    const possuiFoto = Boolean(avatarDataUrl);

    profileAvatarImage.src = avatarDataUrl;
    profileAvatarImage.classList.toggle("is-hidden", !possuiFoto);
    profileAvatarFallback.classList.toggle("is-hidden", possuiFoto);
    documentGreetingAvatarImage.src = avatarDataUrl;
    documentGreetingAvatarImage.classList.toggle("is-hidden", !possuiFoto);
    documentGreetingAvatarFallback.classList.toggle("is-hidden", possuiFoto);
    profileAvatarPreviewImage.src = avatarDataUrl;
    profileAvatarPreviewImage.classList.toggle("is-hidden", !possuiFoto);
    profileAvatarPreviewFallback.classList.toggle("is-hidden", possuiFoto);
    profileAvatarRemoveButton.classList.toggle("is-hidden", !possuiFoto);
}

function mostrarMensagemFotoPerfil(texto, tipo) {
    profileAvatarMessage.textContent = texto || "";
    profileAvatarMessage.className = `message profile-avatar-message ${tipo || ""}`.trim();
}

function alternarCarregamentoFotoPerfil(carregando) {
    profileAvatarChangeButton.disabled = carregando;
    profileAvatarRemoveButton.disabled = carregando;
    profileAvatarChangeButton.querySelector("span").textContent = carregando ? "Salvando..." : "Adicionar foto ao perfil";
}

function abrirTipoDocumento(tipoDocumento) {
    if (!documentoEstaDisponivel(tipoDocumento)) {
        informarLimiteDocumento(tipoDocumento);
        navegarTelaInicialDocumentos("documents", { focusSearch: false });
        return;
    }

    if (tipoDocumento !== "admin") {
        registrarDocumentoRecente(tipoDocumento);
    }

    if (tipoDocumento === "admin") {
        abrirPainelAdmin();
        return;
    }

    if (tipoDocumento === "comodato") {
        garantirBotoesLimparCampos();
        // Mostrar botão de PDF
        if (printPdfButton) {
            printPdfButton.style.display = "inline-block";
            // Guardar tipo de documento para usar no botão de PDF
            printPdfButton.dataset.documentType = "comodato";
        }
        mostrarTela("generator");
        return;
    }

    if (tipoDocumento === "pdf-local") {
        abrirFerramentasPdfLocais();
        return;
    }

    abrirDocumentoSimples(tipoDocumento);
}

function criarBotaoLimparCampos(id, referencia) {
    if (!referencia) {
        return null;
    }

    const botao = document.createElement("button");
    botao.type = "button";
    botao.id = id;
    botao.className = "secondary-button";
    botao.textContent = "Limpar campos";
    referencia.insertAdjacentElement("afterend", botao);
    return botao;
}

function vincularBotaoLimparCampos(botao, handler) {
    if (!botao || botao.dataset.clearFieldsBound === "yes") {
        return;
    }

    botao.addEventListener("click", handler);
    botao.dataset.clearFieldsBound = "yes";
}

function mostrarBotaoLimparCampos(botao) {
    if (!botao) {
        return;
    }

    botao.hidden = false;
    botao.style.display = "";
    botao.classList.remove("is-hidden");
    botao.textContent = "Limpar campos";
}

function garantirBotoesLimparCampos() {
    if (!clearContractFormButton) {
        clearContractFormButton = document.getElementById("clearContractFormButton")
            || criarBotaoLimparCampos("clearContractFormButton", button);
    }

    if (!simpleDocumentClearButton) {
        simpleDocumentClearButton = document.getElementById("simpleDocumentClearButton")
            || criarBotaoLimparCampos("simpleDocumentClearButton", simpleDocumentButton);
    }

    vincularBotaoLimparCampos(clearContractFormButton, limparFormularioContrato);
    vincularBotaoLimparCampos(simpleDocumentClearButton, limparFormularioDocumentoSimplesAtual);
    mostrarBotaoLimparCampos(clearContractFormButton);
    mostrarBotaoLimparCampos(simpleDocumentClearButton);
}

function configurarNavegacaoDocumentos() {
    documentTypeButtons.forEach((buttonDocumento) => {
        buttonDocumento.addEventListener("click", () => abrirTipoDocumento(buttonDocumento.dataset.documentType));
    });

    backToDocumentsButton.addEventListener("click", () => {
        limparMensagem();
        mostrarTela("documents");
    });

    backToDocumentsFromSimpleButton.addEventListener("click", () => {
        limparMensagemDocumentoSimples();
        mostrarTela("documents");
    });

    backToDocumentsFromAdminButton.addEventListener("click", () => {
        limparMensagemAdmin();
        mostrarTela("documents");
    });

    backToDocumentsFromPdfLocalButton.addEventListener("click", () => {
        limparFormularioPdfLocal();
        mostrarTela("documents");
    });


    logoutButtons.forEach((logoutButton) => {
        logoutButton.addEventListener("click", sairDoSistema);
    });
}

function configurarFormularioContrato() {
    conjugeRadios.forEach((radio) => {
        radio.addEventListener("change", atualizarSecaoConjuge);
    });
    obitoRadios.forEach((radio) => {
        radio.addEventListener("change", atualizarSecaoObito);
    });

    atualizarSecaoConjuge();
    atualizarSecaoObito();

    garantirBotoesLimparCampos();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagem();

        if (usuarioAtualTemPlanoBasicoSemWord()) {
            mostrarMensagem("No Plano Básico, use o botão Imprimir como PDF.", "");
            return;
        }

        if (!validarCamposObrigatorios()) {
            return;
        }

        alternarCarregamento(true);

        try {
            mostrarMensagem("Carregando bibliotecas de geração...", "");
            await garantirBibliotecas();

            const dados = coletarDadosDoFormulario();
            const arquivoFinal = await gerarArquivoDocx(dados, obterCaminhoDoModelo());

            await registrarUsoDocumentoNoServidor("comodato");
            window.saveAs(arquivoFinal, "contrato-comodato-preenchido.docx");
            registrarDocumentoGerado();
            mostrarMensagem("Contrato gerado com sucesso.", "success");
        } catch (error) {
            console.error(error);
            tratarErro(error);
        } finally {
            alternarCarregamento(false);
        }
    });
}

function configurarFormularioDocumentoSimples() {
    garantirBotoesLimparCampos();

    simpleDocumentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagemDocumentoSimples();

        if (usuarioAtualTemPlanoBasicoSemWord()) {
            mostrarMensagemDocumentoSimples("No Plano Básico, use o botão Imprimir como PDF.", "");
            return;
        }

        if (!documentoSimplesAtual || !validarDocumentoSimples()) {
            return;
        }

        alternarCarregamentoDocumentoSimples(true);

        try {
            mostrarMensagemDocumentoSimples("Carregando bibliotecas de geração...", "");
            await garantirBibliotecas();

            const dados = coletarDadosDocumentoSimples();
            const arquivoFinal = await gerarArquivoDocx(dados, obterCaminhoModeloDocumentoSimples(dados));
            const nomeArquivo = obterNomeArquivoDocumentoSimples(dados);

            await registrarUsoDocumentoNoServidor(documentoSimplesTipoAtual);
            window.saveAs(arquivoFinal, nomeArquivo);
            registrarDocumentoGerado();
            mostrarMensagemDocumentoSimples("Documento gerado com sucesso. O download foi iniciado.", "success");
        } catch (error) {
            console.error(error);
            tratarErro(error, mostrarMensagemDocumentoSimples);
        } finally {
            alternarCarregamentoDocumentoSimples(false);
        }
    });
}

function configurarPainelAdmin() {
    adminAccessForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagemAdmin();

        if (!usuarioAtualEhAdmin) {
            mostrarMensagemAdmin("Apenas administradores podem criar ou alterar acessos.", "error");
            return;
        }

        if (!validarFormularioAdmin()) {
            return;
        }

        const editando = Boolean(adminEditingUid.value);
        alternarAdminCarregamento(true, editando ? "Salvando..." : "Criando...");

        try {
            if (editando) {
                await editarUsuarioAdmin(adminEditingUid.value);
                mostrarMensagemAdmin("Login atualizado com sucesso.", "success");
            } else {
                await criarUsuarioAdmin();
                mostrarMensagemAdmin("Login criado e assinatura configurada com sucesso.", "success");
            }

            limparFormularioAdmin();
            await carregarUsuariosAdmin();
        } catch (error) {
            console.error(error);
            mostrarMensagemAdmin(traduzirErroApi(error), "error");
        } finally {
            alternarAdminCarregamento(false);
        }
    });

    refreshAdminUsersButton.addEventListener("click", carregarUsuariosAdmin);
    adminApkUploadForm?.addEventListener("submit", enviarApkAdmin);
    adminApkDeleteButton?.addEventListener("click", excluirApkAdmin);
    adminAddQuotaNowButton.addEventListener("click", () => ajustarSaldoDocumentoAdmin("add"));
    adminSubtractQuotaNowButton.addEventListener("click", () => ajustarSaldoDocumentoAdmin("subtract"));
    adminAddPdfToolQuotaButton.addEventListener("click", () => ajustarSaldoPdfAdmin("add"));
    adminSubtractPdfToolQuotaButton.addEventListener("click", () => ajustarSaldoPdfAdmin("subtract"));
    adminHistoryCloseButton.addEventListener("click", fecharHistoricoUsuarioAdmin);
    refreshAdminSupportButton.addEventListener("click", carregarAtendimentosAdmin);
    adminSupportList.addEventListener("click", async (event) => {
        const downloadButton = event.target.closest("[data-support-download]");

        if (downloadButton) {
            await baixarAnexoAtendimento(downloadButton.dataset.supportDownload, downloadButton.dataset.attachmentName);
            return;
        }

        const replyButton = event.target.closest("[data-support-reply]");

        if (replyButton) {
            const message = window.prompt(`Responder para ${replyButton.dataset.supportReply}:`);

            if (message?.trim()) {
                await enviarRespostaAdmin(replyButton.dataset.supportReply, replyButton.dataset.customerName, message.trim());
            }
        }
    });

    adminUsersList.addEventListener("click", async (event) => {
        const actionButton = event.target.closest("[data-admin-action]");

        if (!actionButton) {
            return;
        }

        if (actionButton.dataset.adminAction === "edit") {
            preencherFormularioAdminEdicao(actionButton.dataset.uid);
            return;
        }

        if (actionButton.dataset.adminAction === "history") {
            await carregarHistoricoUsuarioAdmin(actionButton.dataset.uid);
            return;
        }

        actionButton.disabled = true;

        try {
            await apiRequest(`/api/admin/users/${actionButton.dataset.uid}/actions`, {
                method: "POST",
                body: {
                    action: actionButton.dataset.adminAction,
                },
            });
            mostrarMensagemAdmin("Acesso atualizado com sucesso.", "success");
            await carregarUsuariosAdmin();
        } catch (error) {
            console.error(error);
            mostrarMensagemAdmin(traduzirErroApi(error), "error");
            actionButton.disabled = false;
        }
    });
}

async function criarUsuarioAdmin() {
    await apiRequest("/api/admin/users", {
        method: "POST",
        body: {
            name: adminUserName.value.trim(),
            email: adminUserEmail.value.trim(),
            password: adminUserPassword.value,
            plan: normalizePlanId(adminUserPlan.value),
            status: adminUserStatus.value,
            dailyDocumentLimit: Number(adminUserDailyDocumentLimit.value),
            dailyQuotaRenewalEnabled: adminUserDailyQuotaRenewal.value === "yes",
            allowPdfTools: adminUserPdfTools.value === "yes",
            pdfToolDailyLimit: Number(adminUserPdfToolDailyLimit.value),
            pdfToolQuotaRenewalEnabled: adminUserPdfToolQuotaRenewal.value === "yes",
            isVerified: adminUserVerified.value === "yes",
            allowLiquidGlass: adminUserLiquidGlass.value === "yes",
            allowedDocumentTypes: obterDocumentosLiberadosAdmin(),
            notes: adminUserNotes.value.trim(),
            isAdmin: false,
        },
    });
}

async function editarUsuarioAdmin(uid) {
    const usuarioAtualizado = montarDadosUsuarioAdmin(uid);

    await apiRequest(`/api/admin/users/${uid}`, {
        method: "PUT",
        body: usuarioAtualizado,
    });
}

async function ajustarSaldoDocumentoAdmin(tipoAjuste) {
    limparMensagemAdmin();

    if (!usuarioAtualEhAdmin) {
        mostrarMensagemAdmin("Apenas administradores podem ajustar saldo.", "error");
        return;
    }

    const uid = adminEditingUid.value;

    if (!uid) {
        mostrarMensagemAdmin("Clique em Editar no usuário antes de ajustar saldo manual.", "error");
        return;
    }

    const amount = Number(adminUserQuotaAddAmount.value);

    if (!Number.isInteger(amount) || amount < 1 || amount > 999) {
        mostrarMensagemAdmin("Informe uma quantidade entre 1 e 999 para ajustar.", "error");
        adminUserQuotaAddAmount.focus();
        return;
    }

    const documentType = adminUserQuotaDocument.value;

    if (!documentType) {
        mostrarMensagemAdmin("Escolha qual documento tera o saldo ajustado.", "error");
        adminUserQuotaDocument.focus();
        return;
    }

    const botao = tipoAjuste === "subtract" ? adminSubtractQuotaNowButton : adminAddQuotaNowButton;
    const textoOriginal = botao.textContent;
    const action = tipoAjuste === "subtract" ? "subtractDocumentQuota" : "addDocumentQuota";
    const sinal = tipoAjuste === "subtract" ? "-" : "+";
    botao.disabled = true;
    botao.textContent = tipoAjuste === "subtract" ? "Diminuindo..." : "Adicionando...";

    try {
        await apiRequest(`/api/admin/users/${uid}/actions`, {
            method: "POST",
            body: {
                action,
                amount,
                documentType,
            },
        });
        mostrarMensagemAdmin(`Saldo ajustado: ${sinal}${amount} em ${obterTituloSaldoAdmin(documentType)}.`, "success");
        await carregarUsuariosAdmin();
        await carregarResumoSaldoUsuarioAdmin(uid);
    } catch (error) {
        console.error(error);
        mostrarMensagemAdmin(traduzirErroApi(error), "error");
    } finally {
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}

function obterTituloSaldoAdmin(documentType) {
    return documentType === "all" ? "todos os documentos" : obterTituloDocumento(documentType);
}

async function carregarResumoSaldoUsuarioAdmin(uid) {
    if (!adminUserQuotaSummary) {
        return;
    }

    adminUserQuotaSummary.innerHTML = "<p>Carregando saldo dos documentos...</p>";

    try {
        const data = await apiRequest(`/api/admin/users/${uid}/document-usage`);
        renderizarResumoSaldoAdmin(data.documentUsage);
    } catch (error) {
        console.error(error);
        adminUserQuotaSummary.innerHTML = "<p>Não foi possível carregar o saldo deste usuário.</p>";
    }
}

function renderizarResumoSaldoAdmin(usage) {
    if (!adminUserQuotaSummary) {
        return;
    }

    adminUserQuotaSummary.textContent = "";

    if (!usage) {
        const vazio = document.createElement("p");
        vazio.textContent = "Edite um usuário para ver e controlar o saldo por documento.";
        adminUserQuotaSummary.appendChild(vazio);
        return;
    }

    if (usage.unlimited) {
        const ilimitado = document.createElement("p");
        ilimitado.textContent = "Este usuário está em um plano sem limite diário de documentos.";
        adminUserQuotaSummary.appendChild(ilimitado);
        return;
    }

    const header = document.createElement("div");
    header.className = "admin-quota-summary-header";
    header.innerHTML = `
        <strong>Saldo atual por documento</strong>
        <span>${usage.renewalEnabled === false ? "Renovação diária desligada" : `Renova +${usage.dailyAdd || usage.limit || 5} às ${obterHorarioResetUsoDiario()}`}</span>
    `;

    const grid = document.createElement("div");
    grid.className = "admin-quota-summary-grid";

    [...DAILY_LIMIT_DOCUMENT_TYPES].forEach((documentType) => {
        const documentQuota = usage.documents?.[documentType];
        const remaining = Math.max(0, Number(documentQuota?.remaining || 0));
        const item = document.createElement("button");
        item.type = "button";
        item.className = `admin-quota-summary-item${remaining <= 0 ? " is-empty" : ""}`;
        item.dataset.quotaDocument = documentType;
        item.innerHTML = `
            <span>${escaparHtmlSeguro(obterTituloDocumento(documentType))}</span>
            <strong>${remaining}</strong>
        `;
        item.addEventListener("click", () => {
            adminUserQuotaDocument.value = documentType;
            adminUserQuotaDocument.focus();
        });
        grid.appendChild(item);
    });

    adminUserQuotaSummary.append(header, grid);
}

async function ajustarSaldoPdfAdmin(tipoAjuste) {
    limparMensagemAdmin();

    if (!usuarioAtualEhAdmin) {
        mostrarMensagemAdmin("Apenas administradores podem ajustar saldo PDF.", "error");
        return;
    }

    const uid = adminEditingUid.value;

    if (!uid) {
        mostrarMensagemAdmin("Clique em Editar no usuario antes de ajustar saldo PDF.", "error");
        return;
    }

    const amount = Number(adminUserPdfToolQuotaAmount.value);

    if (!Number.isInteger(amount) || amount < 1 || amount > 999) {
        mostrarMensagemAdmin("Informe uma quantidade entre 1 e 999 para ajustar PDF.", "error");
        adminUserPdfToolQuotaAmount.focus();
        return;
    }

    const toolType = adminUserPdfToolOperation.value;

    if (!toolType) {
        mostrarMensagemAdmin("Escolha qual ferramenta PDF tera o saldo ajustado.", "error");
        adminUserPdfToolOperation.focus();
        return;
    }

    const botao = tipoAjuste === "subtract" ? adminSubtractPdfToolQuotaButton : adminAddPdfToolQuotaButton;
    const textoOriginal = botao.textContent;
    const action = tipoAjuste === "subtract" ? "subtractPdfToolQuota" : "addPdfToolQuota";
    const sinal = tipoAjuste === "subtract" ? "-" : "+";
    botao.disabled = true;
    botao.textContent = tipoAjuste === "subtract" ? "Diminuindo..." : "Adicionando...";

    try {
        await apiRequest(`/api/admin/users/${uid}/actions`, {
            method: "POST",
            body: {
                action,
                amount,
                toolType,
            },
        });
        mostrarMensagemAdmin(`Saldo PDF ajustado: ${sinal}${amount} em ${obterTituloFerramentaPdf(toolType)}.`, "success");
        await carregarUsuariosAdmin();
        await carregarResumoPdfUsuarioAdmin(uid);
    } catch (error) {
        console.error(error);
        mostrarMensagemAdmin(traduzirErroApi(error), "error");
    } finally {
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}

async function carregarResumoPdfUsuarioAdmin(uid) {
    if (!adminUserPdfToolQuotaSummary) {
        return;
    }

    adminUserPdfToolQuotaSummary.innerHTML = "<p>Carregando saldo das ferramentas PDF...</p>";

    try {
        const data = await apiRequest(`/api/admin/users/${uid}/pdf-usage`);
        renderizarResumoPdfAdmin(data.pdfToolUsage);
    } catch (error) {
        console.error(error);
        adminUserPdfToolQuotaSummary.innerHTML = "<p>Nao foi possivel carregar o saldo PDF deste usuario.</p>";
    }
}

function renderizarResumoPdfAdmin(usage) {
    if (!adminUserPdfToolQuotaSummary) {
        return;
    }

    adminUserPdfToolQuotaSummary.textContent = "";

    if (!usage) {
        const vazio = document.createElement("p");
        vazio.textContent = "Edite um usuario para ver e controlar o saldo por ferramenta PDF.";
        adminUserPdfToolQuotaSummary.appendChild(vazio);
        return;
    }

    if (!usage.allowed) {
        const bloqueado = document.createElement("p");
        bloqueado.textContent = "Ferramentas PDF ainda nao foram liberadas para este usuario.";
        adminUserPdfToolQuotaSummary.appendChild(bloqueado);
        return;
    }

    if (usage.unlimited) {
        const ilimitado = document.createElement("p");
        ilimitado.textContent = "Este usuario tem uso livre das ferramentas PDF.";
        adminUserPdfToolQuotaSummary.appendChild(ilimitado);
        return;
    }

    const header = document.createElement("div");
    header.className = "admin-quota-summary-header";
    header.innerHTML = `
        <strong>Saldo atual por ferramenta PDF</strong>
        <span>${usage.renewalEnabled === false ? "Renovacao diaria desligada" : `Renova +${usage.dailyAdd || usage.limit || 5} as ${obterHorarioResetUsoDiario()}`}</span>
    `;

    const grid = document.createElement("div");
    grid.className = "admin-quota-summary-grid";

    [...PDF_TOOL_TYPES].forEach((toolType) => {
        const toolQuota = usage.tools?.[toolType];
        const remaining = Math.max(0, Number(toolQuota?.remaining || 0));
        const item = document.createElement("button");
        item.type = "button";
        item.className = `admin-quota-summary-item${remaining <= 0 ? " is-empty" : ""}`;
        item.dataset.quotaPdfTool = toolType;
        item.innerHTML = `
            <span>${escaparHtmlSeguro(obterTituloFerramentaPdf(toolType))}</span>
            <strong>${remaining}</strong>
        `;
        item.addEventListener("click", () => {
            adminUserPdfToolOperation.value = toolType;
            adminUserPdfToolOperation.focus();
        });
        grid.appendChild(item);
    });

    adminUserPdfToolQuotaSummary.append(header, grid);
}

async function carregarHistoricoUsuarioAdmin(uid) {
    const usuario = adminUsersCache[uid];

    if (!adminHistoryPanel || !adminHistoryList) {
        return;
    }

    adminHistoryPanel.classList.remove("is-hidden");
    adminHistoryTitle.textContent = `Histórico de ${usuario?.name || "usuário"}`;
    adminHistoryList.innerHTML = '<div class="empty-state">Carregando histórico...</div>';
    adminHistoryPanel.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
        const data = await apiRequest(`/api/admin/users/${uid}/history`);
        renderizarHistoricoUsuarioAdmin(data.history || []);
    } catch (error) {
        console.error(error);
        adminHistoryList.innerHTML = '<div class="empty-state">Não foi possível carregar o histórico.</div>';
    }
}

function fecharHistoricoUsuarioAdmin() {
    adminHistoryPanel?.classList.add("is-hidden");
    if (adminHistoryList) {
        adminHistoryList.textContent = "";
    }
}

function renderizarHistoricoUsuarioAdmin(history) {
    adminHistoryList.textContent = "";

    if (!history.length) {
        adminHistoryList.innerHTML = '<div class="empty-state">Nenhum evento registrado para este usuário ainda.</div>';
        return;
    }

    history.forEach((item) => {
        const evento = document.createElement("article");
        evento.className = "admin-history-item";
        const descricao = descreverEventoHistoricoAdmin(item);
        const actor = item.actor?.name || item.actor?.email || "Sistema";
        evento.innerHTML = `
            <div>
                <strong>${escaparHtmlSeguro(descricao.titulo)}</strong>
                <p>${escaparHtmlSeguro(descricao.detalhe || `Por ${actor}`)}</p>
            </div>
            <time>${formatarDataHora(item.createdAt)}</time>
        `;
        adminHistoryList.appendChild(evento);
    });
}

function descreverEventoHistoricoAdmin(item) {
    const details = item.details || {};
    const actor = item.actor?.name || item.actor?.email || "Sistema";
    const documentTitle = details.documentType ? obterTituloSaldoAdmin(details.documentType) : "";

    const descricoes = {
        login: () => ({ titulo: "Entrou no sistema", detalhe: item.actor?.email || "" }),
        generate_document: () => ({ titulo: `Gerou documento: ${documentTitle}`, detalhe: "Saldo consumido e documento baixado." }),
        preview_pdf: () => ({ titulo: `Gerou prévia PDF: ${documentTitle}`, detalhe: "Prévia ou PDF criado pelo sistema." }),
        create_user: () => ({ titulo: "Login criado", detalhe: `Por ${actor}` }),
        update_user: () => ({ titulo: "Login atualizado", detalhe: `Por ${actor}` }),
        block: () => ({ titulo: "Acesso bloqueado", detalhe: `Por ${actor}` }),
        unblock: () => ({ titulo: "Acesso liberado", detalhe: `Por ${actor}` }),
        renewCurrent: () => ({ titulo: "Plano renovado", detalhe: `Por ${actor}` }),
        renewMonthly: () => ({ titulo: "Plano renovado para básico", detalhe: `Por ${actor}` }),
        renewAnnual: () => ({ titulo: "Plano renovado para Pro Max", detalhe: `Por ${actor}` }),
        addDocumentQuota: () => ({ titulo: `Saldo adicionado: +${details.amount || 0}`, detalhe: `${obterTituloSaldoAdmin(details.documentType || "all")} - por ${actor}` }),
        subtractDocumentQuota: () => ({ titulo: `Saldo diminuído: -${details.amount || 0}`, detalhe: `${obterTituloSaldoAdmin(details.documentType || "all")} - por ${actor}` }),
        send_payment_proof: () => ({ titulo: "Comprovante enviado", detalhe: details.plan ? `Plano: ${getPlan(details.plan)?.label || details.plan}` : "" }),
        reply_support: () => ({ titulo: "Resposta de atendimento enviada", detalhe: `Por ${actor}` }),
        update_profile_avatar: () => ({ titulo: "Foto de perfil atualizada", detalhe: "" }),
        remove_profile_avatar: () => ({ titulo: "Foto de perfil removida", detalhe: "" }),
    };

    return (descricoes[item.action] || (() => ({ titulo: item.action || "Evento registrado", detalhe: `Por ${actor}` })))();
}

function montarDadosUsuarioAdmin(uid) {
    const usuarioOriginal = adminUsersCache[uid] || {};
    const dados = {
        name: adminUserName.value.trim(),
        email: adminUserEmail.value.trim(),
        plan: normalizePlanId(adminUserPlan.value),
        status: adminUserStatus.value,
        dailyDocumentLimit: Number(adminUserDailyDocumentLimit.value),
        dailyQuotaRenewalEnabled: adminUserDailyQuotaRenewal.value === "yes",
        allowPdfTools: adminUserPdfTools.value === "yes",
        pdfToolDailyLimit: Number(adminUserPdfToolDailyLimit.value),
        pdfToolQuotaRenewalEnabled: adminUserPdfToolQuotaRenewal.value === "yes",
        isVerified: adminUserVerified.value === "yes",
        allowLiquidGlass: adminUserLiquidGlass.value === "yes",
        allowedDocumentTypes: obterDocumentosLiberadosAdmin(),
        notes: adminUserNotes.value.trim(),
        isAdmin: Boolean(usuarioOriginal.isAdmin),
    };

    if (adminUserPassword.value.trim()) {
        dados.password = adminUserPassword.value;
    }

    return dados;
}

async function inicializarSessao() {
    mostrarTela("auth");
    alternarLoginCarregamento(true, "Verificando...");

    try {
        const data = await apiRequest("/api/session");
        aplicarSessao(data);
    } catch (error) {
        limparSessaoLocal();
        mostrarTela("auth");
    } finally {
        alternarLoginCarregamento(false);
    }
}

function aplicarSessao(data) {
    usuarioAtual = data.user;
    billingUser = null;
    localStorage.removeItem(BILLING_TOKEN_KEY);
    usuarioAtualEhAdmin = Boolean(usuarioAtual?.isAdmin);
    aplicarUsoDiarioDocumentos(data.documentUsage);
    aplicarUsoFerramentasPdf(data.pdfToolUsage);
    atualizarUsuario(usuarioAtual);
    atualizarVisibilidadeAdmin();
    limparMensagemLogin();
    mostrarMensagemAcesso(data.message || montarMensagemPlano(usuarioAtual), "success");
    atualizarAcoesPlano();
    mostrarTela("documents");
    mostrarAvisoPrivacidadeSeNecessario();
    agendarEncerramentoPorVencimento(usuarioAtual);
    iniciarVerificacaoPeriodicaAcesso();
    mostrarAvisoRenovacao(data.renewalWarning);
}

function limparSessaoLocal() {
    pararObservacaoAcesso();
    usuarioAtual = null;
    usuarioAtualEhAdmin = false;
    aplicarUsoDiarioDocumentos(null);
    aplicarUsoFerramentasPdf(null);
    atualizarUsuario(null);
    atualizarVisibilidadeAdmin();
    atualizarAcoesPlano();
    limparMensagemAcesso();
    fecharPagamentoPlano();
}

async function sairDoSistema() {
    try {
        await apiRequest("/api/auth/logout", {
            method: "POST",
        });
    } catch (error) {
        console.warn("Não foi possível encerrar a sessão no servidor.", error);
    }

    limparSessaoLocal();
    billingUser = null;
    localStorage.removeItem(BILLING_TOKEN_KEY);
    mostrarTela("auth");
}

async function validarSessaoAtiva() {
    try {
        const data = await apiRequest("/api/session");
        usuarioAtual = data.user;
        usuarioAtualEhAdmin = Boolean(usuarioAtual?.isAdmin);
        aplicarUsoDiarioDocumentos(data.documentUsage);
        aplicarUsoFerramentasPdf(data.pdfToolUsage);
        atualizarUsuario(usuarioAtual);
        atualizarVisibilidadeAdmin();
        mostrarMensagemAcesso(data.message || montarMensagemPlano(usuarioAtual), "success");
        atualizarAcoesPlano();
        agendarEncerramentoPorVencimento(usuarioAtual);
    } catch (error) {
        await encerrarSessaoPorAcesso(traduzirErroApi(error));
    }
}

function iniciarVerificacaoPeriodicaAcesso() {
    if (accessCheckInterval) {
        window.clearInterval(accessCheckInterval);
    }

    accessCheckInterval = window.setInterval(validarSessaoAtiva, 60000);
}

function agendarEncerramentoPorVencimento(registro) {
    if (accessExpirationTimer) {
        window.clearTimeout(accessExpirationTimer);
        accessExpirationTimer = null;
    }

    if (!registro?.expiresAt || registro.isAdmin) {
        return;
    }

    const vencimento = new Date(registro.expiresAt).getTime();
    const tempoAteVencer = vencimento - Date.now();

    if (!Number.isFinite(vencimento)) {
        return;
    }

    if (tempoAteVencer <= 0) {
        validarSessaoAtiva();
        return;
    }

    accessExpirationTimer = window.setTimeout(validarSessaoAtiva, tempoAteVencer + 1000);
}

function pararObservacaoAcesso() {
    if (accessExpirationTimer) {
        window.clearTimeout(accessExpirationTimer);
        accessExpirationTimer = null;
    }

    if (accessCheckInterval) {
        window.clearInterval(accessCheckInterval);
        accessCheckInterval = null;
    }
}

async function encerrarSessaoPorAcesso(mensagem) {
    await apiRequest("/api/auth/logout", {
        method: "POST",
    }).catch(() => {});

    limparSessaoLocal();
    mostrarTela("auth");
    mostrarLoginMensagem(mensagem || "Sessão encerrada. Entre novamente.", "error");
}

function abrirDocumentoSimples(tipoDocumento) {
    const config = SIMPLE_DOCUMENTS[tipoDocumento];

    if (!config) {
        return;
    }

    garantirBotoesLimparCampos();
    documentoSimplesAtual = config;
    documentoSimplesTipoAtual = tipoDocumento;
    window.documentoSimplesTipoAtual = tipoDocumento;
    simpleDocumentTitle.textContent = config.title;
    simpleDocumentDescription.textContent = config.description;
    simpleDocumentButton.textContent = "Gerar documento";
    atualizarBotoesGeracaoPorPlano();

    // Mostrar botão de PDF
    if (simplePrintPdfButton) {
        simplePrintPdfButton.style.display = "inline-block";
        simplePrintPdfButton.dataset.documentType = tipoDocumento;
    }

    renderizarCamposDocumentoSimples(config);
    limparMensagemDocumentoSimples();
    mostrarTela("simpleDocument");

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
    });
}

function renderizarCamposDocumentoSimples(config) {
    simpleDocumentFields.textContent = "";

    if (config.modelChoice) {
        simpleDocumentFields.appendChild(criarCampoEscolhaDocumento(config.modelChoice));
    }

    config.sections.forEach((section) => {
        const title = document.createElement("h2");
        title.className = "section-title";
        title.textContent = section.title;
        simpleDocumentFields.appendChild(title);

        (section.fields || []).forEach((field) => {
            simpleDocumentFields.appendChild(criarCampoDocumentoSimples(field));
        });

        if (section.repeatableGroup) {
            simpleDocumentFields.appendChild(criarGrupoRepetivelDocumento(section.repeatableGroup));
        }

        if (section.conditionalChoice) {
            const conditionalFields = criarCamposCondicionaisDocumento(section.conditionalChoice);
            simpleDocumentFields.append(
                criarCampoEscolhaDocumento(section.conditionalChoice, () => {
                    atualizarCamposCondicionaisDocumento(section.conditionalChoice);
                }),
                conditionalFields
            );
            atualizarCamposCondicionaisDocumento(section.conditionalChoice);
        }
    });

    configurarOcultarCondicaoGrupoFamiliar();
    configurarExperienciaFormulario(simpleDocumentForm, {
        title: config.title,
    });
}

function configurarOcultarCondicaoGrupoFamiliar() {
    if (!simpleDocumentForm || !simpleDocumentFields) {
        return;
    }

    const seletoresSituacao = [
        'input[name="situacao_individual_1"]',
        'input[name="situacao_regime_1"]',
        'input[name="situacao_individual_2"]',
        'input[name="situacao_regime_2"]',
        'input[name="situacao_individual_3"]',
        'input[name="situacao_regime_3"]',
    ].join(",");

    function buscarInput(nome) {
        return simpleDocumentForm.querySelector(`input[name="${nome}"]`);
    }

    function buscarTitulo(textoInicial) {
        return Array.from(simpleDocumentFields.querySelectorAll(".section-title"))
            .find((titulo) => titulo.textContent.trim().startsWith(textoInicial));
    }

    function coletarSecoes21e22() {
        const titulo21 = buscarTitulo("2.1 Condição no grupo familiar");

        if (!titulo21) {
            return [];
        }

        const elementos = [];
        let atual = titulo21;

        while (atual) {
            const texto = atual.textContent?.trim() || "";

            const chegouNaProximaSecao =
                atual !== titulo21 &&
                atual.classList.contains("section-title") &&
                !texto.startsWith("2.2 Grupo Familiar");

            if (chegouNaProximaSecao) {
                break;
            }

            elementos.push(atual);
            atual = atual.nextElementSibling;
        }

        return elementos;
    }

    function limparCamposDaSecao(elementos) {
        elementos.forEach((elemento) => {
            elemento.querySelectorAll("input, select, textarea").forEach((campo) => {
                if (campo.type === "checkbox" || campo.type === "radio") {
                    campo.checked = false;
                } else {
                    campo.value = "";
                }

                campo.disabled = true;
                campo.required = false;
                campo.classList.remove("is-invalid");
                campo.removeAttribute("aria-invalid");
            });
        });
    }

    function liberarCamposDaSecao(elementos) {
        elementos.forEach((elemento) => {
            elemento.querySelectorAll("input, select, textarea").forEach((campo) => {
                campo.disabled = false;
                campo.required = false;
            });
        });
    }

    function mostrarOuOcultarSecoes(elementos, ocultar) {
        elementos.forEach((elemento) => {
            if (ocultar) {
                elemento.style.display = "none";
                elemento.setAttribute("aria-hidden", "true");
            } else {
                elemento.style.removeProperty("display");
                elemento.removeAttribute("aria-hidden");
            }
        });
    }

    function atualizarVisibilidadeCondicaoGrupoFamiliar() {
        const individualmenteMarcado = [
            buscarInput("situacao_individual_1"),
            buscarInput("situacao_individual_2"),
            buscarInput("situacao_individual_3"),
        ]
            .filter(Boolean)
            .some((input) => input.checked);

        const elementos21e22 = coletarSecoes21e22();

        mostrarOuOcultarSecoes(elementos21e22, individualmenteMarcado);

        if (individualmenteMarcado) {
            limparCamposDaSecao(elementos21e22);
        } else {
            liberarCamposDaSecao(elementos21e22);
        }
    }

    if (simpleDocumentForm.dataset.condicaoGrupoFamiliarListener !== "true") {
        simpleDocumentForm.addEventListener("change", (event) => {
            if (event.target.matches(seletoresSituacao)) {
                atualizarVisibilidadeCondicaoGrupoFamiliar();
            }
        });

        simpleDocumentForm.dataset.condicaoGrupoFamiliarListener = "true";
    }

    atualizarVisibilidadeCondicaoGrupoFamiliar();
}

function criarCampoDocumentoSimples(field) {
    const label = document.createElement("label");
    label.className = `${field.type === "checkbox" ? "field checkbox-field" : "field"}${field.wide ? " field-wide" : ""}`;

    const span = document.createElement("span");
    span.textContent = field.label;

    const automaticOptions = obterOpcoesAutomaticasCampo(field);
    const input = automaticOptions
        ? criarSelectDocumentoSimples(automaticOptions)
        : document.createElement("input");

    if (!automaticOptions) {
        input.type = field.type || "text";
    }

    input.name = field.name;
    input.required = field.required !== false;

    if (field.type === "checkbox") {
        input.value = field.checkedValue || "X";

        if (field.exclusiveGroup) {
            input.dataset.exclusiveGroup = field.exclusiveGroup;
            input.addEventListener("change", () => {
                if (!input.checked) {
                    return;
                }

                simpleDocumentForm.querySelectorAll(`[data-exclusive-group="${field.exclusiveGroup}"]`).forEach((checkbox) => {
                    if (checkbox !== input) {
                        checkbox.checked = false;
                    }
                });
            });
        }
    }

    if (field.autocomplete) {
        input.autocomplete = field.autocomplete;
    }

    if (field.inputmode) {
        input.inputMode = field.inputmode;
    }

    if (field.placeholder) {
        input.placeholder = field.placeholder;
    }

    if (field.type === "checkbox") {
        label.append(input, span);
    } else {
        label.append(span, input);
    }

    return label;
}

function obterOpcoesAutomaticasCampo(field) {
    const chave = normalizarTextoBusca(`${field.name || ""} ${field.label || ""}`);

    if (chave.includes("estado civil")) {
        return MARITAL_STATUS_OPTIONS;
    }

    if (chave === "mes mes" || field.name === "mes") {
        return MONTH_OPTIONS;
    }

    return null;
}

function criarSelectDocumentoSimples(options) {
    const select = document.createElement("select");
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione";
    select.appendChild(placeholder);

    options.forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
    });

    return select;
}

function criarGrupoRepetivelDocumento(config) {
    const container = document.createElement("section");
    container.className = "repeatable-group field-wide";
    container.dataset.repeatableGroup = config.name;

    config.groups.forEach((group, index) => {
        const entry = document.createElement("article");
        const hidden = index > 0;
        entry.className = `repeatable-entry${hidden ? " is-hidden" : ""}`;
        entry.dataset.repeatableEntry = String(index);
        entry.setAttribute("aria-hidden", String(hidden));

        const title = document.createElement("h3");
        title.textContent = group.title;
        entry.appendChild(title);

        group.fields.forEach((field) => {
            entry.appendChild(criarCampoDocumentoSimples(field));
        });

        entry.querySelectorAll("input, select, textarea").forEach((field) => {
            field.disabled = hidden;
        });

        container.appendChild(entry);
    });

    const actions = document.createElement("div");
    actions.className = "repeatable-actions";
    actions.dataset.repeatableActions = config.name;

    const text = document.createElement("span");
    text.textContent = config.promptText || "Deseja adicionar outro item?";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-button";
    button.textContent = config.addButtonText;
    button.addEventListener("click", () => revelarProximoGrupoRepetivel(config.name));

    actions.append(text, button);
    container.appendChild(actions);
    return container;
}

function revelarProximoGrupoRepetivel(groupName) {
    const container = simpleDocumentForm.querySelector(`[data-repeatable-group="${groupName}"]`);
    const nextEntry = container?.querySelector(".repeatable-entry.is-hidden");

    if (!nextEntry) {
        return;
    }

    nextEntry.classList.remove("is-hidden");
    nextEntry.setAttribute("aria-hidden", "false");
    nextEntry.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = false;
    });

    if (!container.querySelector(".repeatable-entry.is-hidden")) {
        container.querySelector(`[data-repeatable-actions="${groupName}"]`)?.classList.add("is-hidden");
    }

    nextEntry.querySelector("input, select, textarea")?.focus();
    atualizarWizardFormulario(simpleDocumentForm);
}

function criarCamposCondicionaisDocumento(choice) {
    const fieldsContainer = document.createElement("section");
    fieldsContainer.className = "conditional-fields field-wide";
    fieldsContainer.dataset.conditionalFields = choice.name;

    if (choice.detailsTitle) {
        const title = document.createElement("h3");
        title.textContent = choice.detailsTitle;
        fieldsContainer.appendChild(title);
    }

    (choice.fieldsWhenYes || []).forEach((field) => {
        fieldsContainer.appendChild(criarCampoDocumentoSimples(field));
    });

    return fieldsContainer;
}

function atualizarCamposCondicionaisDocumento(choice) {
    const fieldsContainer = simpleDocumentForm.querySelector(`[data-conditional-fields="${choice.name}"]`);
    const selected = simpleDocumentForm.elements[choice.name]?.value;
    const showFields = selected === "sim";

    if (!fieldsContainer) {
        return;
    }

    fieldsContainer.classList.toggle("is-hidden", !showFields);
    fieldsContainer.setAttribute("aria-hidden", String(!showFields));

    fieldsContainer.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = !showFields;

        if (!showFields) {
            field.value = "";
            field.classList.remove("is-invalid");
            field.removeAttribute("aria-invalid");
        }
    });
}

function criarCampoEscolhaDocumento(choice, onChange) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "choice-field field-wide";
    const options = choice.options || [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
    ];
    const defaultValue = choice.defaultValue || "nao";

    const legend = document.createElement("legend");
    legend.textContent = choice.title;
    fieldset.appendChild(legend);

    options.forEach((option, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = choice.name;
        input.value = option.value;
        input.required = true;
        input.checked = option.value === defaultValue || (!defaultValue && index === 0);

        if (typeof onChange === "function") {
            input.addEventListener("change", onChange);
        }

        label.append(input, document.createTextNode(option.label));
        fieldset.appendChild(label);
    });

    return fieldset;
}

function configurarExperienciaFormulario(formElement, options = {}) {
    const grid = formElement?.querySelector(".grid");

    if (!grid) {
        return;
    }

    formElement.querySelectorAll("[data-wizard-generated]").forEach((element) => element.remove());
    grid.querySelectorAll(".wizard-step-hidden").forEach((element) => element.classList.remove("wizard-step-hidden"));

    agruparCamposDataFormulario(grid);
    decorarCamposFormulario(formElement);
    decorarTitulosFormulario(grid);

    const steps = obterEtapasFormulario(grid);

    if (!steps.length) {
        return;
    }

    const toolbar = criarToolbarWizard(steps);
    const preview = criarPreviewDocumento(options.title || "Documento");
    const navigation = criarNavegacaoWizard();
    const actions = formElement.querySelector(".actions");

    grid.before(toolbar);
    grid.after(preview, navigation);

    const state = {
        actions,
        currentStep: 0,
        form: formElement,
        navigation,
        options,
        preview,
        steps,
        toolbar,
    };

    wizardStates.set(formElement, state);

    toolbar.querySelectorAll("[data-wizard-step]").forEach((buttonStep) => {
        buttonStep.addEventListener("click", () => {
            mudarEtapaWizard(formElement, Number(buttonStep.dataset.wizardStep), {
                validateForward: true,
            });
        });
    });

    navigation.querySelector("[data-wizard-prev]").addEventListener("click", () => {
        mudarEtapaWizard(formElement, Math.max(0, state.currentStep - 1));
    });

    navigation.querySelector("[data-wizard-next]").addEventListener("click", () => {
        mudarEtapaWizard(formElement, Math.min(state.steps.length - 1, state.currentStep + 1), {
            validateForward: true,
        });
    });

    if (formElement.dataset.wizardListeners !== "true") {
        formElement.addEventListener("input", () => atualizarWizardFormulario(formElement));
        formElement.addEventListener("change", () => {
            window.setTimeout(() => atualizarWizardFormulario(formElement));
        });
        formElement.dataset.wizardListeners = "true";
    }

    mudarEtapaWizard(formElement, 0);
    inicializarIcones();
}

function agruparCamposDataFormulario(grid) {
    if (grid.querySelector(":scope > .date-field-row")) {
        return;
    }

    const directChildren = Array.from(grid.children);
    const encontrarCampo = (name) => directChildren.find((element) => {
        return element.matches("label.field") && element.querySelector(`[name="${name}"]`);
    });
    const day = encontrarCampo("dia");
    const month = encontrarCampo("mes");
    const year = encontrarCampo("ano");

    if (!day || !month || !year) {
        return;
    }

    const row = document.createElement("div");
    row.className = "date-field-row field-wide";
    day.before(row);
    row.append(day, month, year);
}

function decorarCamposFormulario(formElement) {
    formElement.querySelectorAll(".field > span").forEach((span) => {
        if (span.dataset.fieldIconReady === "true") {
            return;
        }

        const icon = document.createElement("i");
        icon.dataset.lucide = obterIconeCampo(span.textContent);
        icon.setAttribute("aria-hidden", "true");
        span.prepend(icon);
        span.dataset.fieldIconReady = "true";
    });
}

function decorarTitulosFormulario(grid) {
    grid.querySelectorAll(".section-title").forEach((title) => {
        if (title.dataset.sectionIconReady === "true") {
            return;
        }

        const icon = document.createElement("i");
        icon.dataset.lucide = obterIconeSecao(title.textContent);
        icon.setAttribute("aria-hidden", "true");
        title.prepend(icon);
        title.dataset.sectionIconReady = "true";
    });

    Array.from(grid.children).forEach((element) => {
        if (!element.classList.contains("section-title")) {
            return;
        }

        const next = element.nextElementSibling;

        if (next?.classList.contains("section-description")) {
            return;
        }

        const description = document.createElement("p");
        description.className = "section-description";
        description.textContent = obterDescricaoSecao(element.textContent);
        element.after(description);
    });
}

function obterIconeCampo(label) {
    const text = normalizarTextoBusca(label);

    if (text.includes("nome")) return "user-round";
    if (text.includes("profissao")) return "briefcase";
    if (text.includes("estado civil")) return "heart";
    if (text.includes("cpf") || text.includes("cnpj")) return "file-text";
    if (text.includes("rg")) return "badge";
    if (text.includes("telefone") || text.includes("celular")) return "smartphone";
    if (text.includes("email") || text.includes("e-mail")) return "mail";
    if (text.includes("endereco") || text.includes("localidade")) return "map-pin";
    if (text.includes("municipio") || text.includes("cidade")) return "building-2";
    if (text.includes("data") || text.includes("dia") || text.includes("mes") || text.includes("ano")) return "calendar-days";
    if (text.includes("area") || text.includes("tamanho")) return "ruler";
    if (text.includes("imovel") || text.includes("propriedade") || text.includes("terra")) return "house";
    if (text.includes("parentesco") || text.includes("familiar")) return "users";
    if (text.includes("atividade") || text.includes("producao")) return "sprout";
    return "square-pen";
}

function obterIconeSecao(title) {
    const text = normalizarTextoBusca(title);

    if (text.includes("conjuge") || text.includes("familiar") || text.includes("membro")) return "users";
    if (text.includes("imovel") || text.includes("terra") || text.includes("propriedade")) return "house";
    if (text.includes("atividade") || text.includes("producao")) return "sprout";
    if (text.includes("data") || text.includes("assinatura")) return "calendar-days";
    if (text.includes("contrato")) return "file-text";
    if (text.includes("endereco") || text.includes("local")) return "map-pin";
    return "user-round";
}

function obterDescricaoSecao(title) {
    const text = normalizarTextoBusca(title);

    if (text.includes("conjuge")) return "Informe os dados somente quando essa opção fizer parte do documento.";
    if (text.includes("imovel") || text.includes("terra")) return "Preencha as informações da propriedade rural com atenção.";
    if (text.includes("data") || text.includes("contrato")) return "Revise os dados finais antes de gerar o arquivo.";
    if (text.includes("atividade")) return "Detalhe as informações correspondentes à atividade rural.";
    return "Preencha as informações desta etapa.";
}

function obterEtapasFormulario(grid) {
    const steps = [];
    const initialElements = [];
    let currentStep = null;

    Array.from(grid.children).forEach((element) => {
        if (element.classList.contains("section-title")) {
            currentStep = {
                elements: [element],
                title: element.textContent.trim(),
            };
            steps.push(currentStep);
            return;
        }

        if (currentStep) {
            currentStep.elements.push(element);
        } else {
            initialElements.push(element);
        }
    });

    if (steps.length && initialElements.length) {
        steps[0].elements.unshift(...initialElements);
    }

    return steps;
}

function criarToolbarWizard(steps) {
    const toolbar = document.createElement("section");
    toolbar.className = "document-wizard";
    toolbar.dataset.wizardGenerated = "true";

    const heading = document.createElement("div");
    heading.className = "wizard-heading";

    const headingCopy = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "wizard-eyebrow";
    eyebrow.dataset.wizardEyebrow = "true";
    const title = document.createElement("h2");
    title.dataset.wizardTitle = "true";
    headingCopy.append(eyebrow, title);

    const percent = document.createElement("strong");
    percent.className = "wizard-percent";
    percent.dataset.wizardPercent = "true";
    heading.append(headingCopy, percent);

    const progress = document.createElement("div");
    progress.className = "wizard-progress-track";
    progress.setAttribute("aria-hidden", "true");
    const progressBar = document.createElement("span");
    progressBar.dataset.wizardProgress = "true";
    progress.appendChild(progressBar);

    const list = document.createElement("div");
    list.className = "wizard-step-list";

    steps.forEach((step, index) => {
        const buttonStep = document.createElement("button");
        buttonStep.type = "button";
        buttonStep.className = "wizard-step-button";
        buttonStep.dataset.wizardStep = String(index);

        const number = document.createElement("span");
        number.textContent = String(index + 1);
        const label = document.createElement("strong");
        label.textContent = resumirTituloEtapa(step.title);
        buttonStep.append(number, label);
        list.appendChild(buttonStep);
    });

    toolbar.append(heading, progress, list);
    return toolbar;
}

function criarPreviewDocumento(title) {
    const preview = document.createElement("aside");
    preview.className = "live-document-preview";
    preview.dataset.wizardGenerated = "true";
    preview.innerHTML = `
        <div class="live-preview-heading">
            <span aria-hidden="true"><i data-lucide="file-check-2"></i></span>
            <div>
                <p>Prévia ao vivo</p>
                <h3>${escaparHtmlSeguro(title)}</h3>
            </div>
        </div>
        <p class="live-preview-note">Resumo visual atualizado enquanto você digita. O arquivo Word completo será baixado ao gerar.</p>
        <dl data-live-preview-values></dl>
    `;
    return preview;
}

function criarNavegacaoWizard() {
    const navigation = document.createElement("div");
    navigation.className = "wizard-navigation";
    navigation.dataset.wizardGenerated = "true";
    navigation.innerHTML = `
        <button type="button" class="secondary-button" data-wizard-prev>
            <i data-lucide="arrow-left" aria-hidden="true"></i>
            <span>Voltar</span>
        </button>
        <span class="wizard-navigation-position" data-wizard-position></span>
        <p class="wizard-inline-message" data-wizard-message aria-live="polite"></p>
        <button type="button" data-wizard-next>
            <span>Continuar</span>
            <i data-lucide="arrow-right" aria-hidden="true"></i>
        </button>
    `;
    return navigation;
}

function mudarEtapaWizard(formElement, targetIndex, options = {}) {
    const state = wizardStates.get(formElement);

    if (!state) {
        return;
    }

    if (options.validateForward && targetIndex > state.currentStep && !validarEtapaWizard(state)) {
        return;
    }

    const limitedTarget = options.validateForward && targetIndex > state.currentStep + 1
        ? state.currentStep + 1
        : targetIndex;
    state.currentStep = Math.min(Math.max(0, limitedTarget), state.steps.length - 1);

    state.steps.forEach((step, stepIndex) => {
        step.elements.forEach((element) => {
            element.classList.toggle("wizard-step-hidden", stepIndex !== state.currentStep);
        });
    });

    atualizarWizardFormulario(formElement);
    formElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

function validarEtapaWizard(state) {
    const controls = obterControlesEtapa(state.steps[state.currentStep])
        .filter((control) => control.required && controleParticipaDoFormulario(control));
    const invalidControls = controls.filter((control) => {
        if (control.type === "radio") {
            return !state.form.querySelector(`[name="${control.name}"]:checked`);
        }

        if (control.type === "checkbox") {
            return !control.checked;
        }

        return !String(control.value || "").trim();
    });

    controls.forEach((control) => control.classList.remove("is-invalid"));
    invalidControls.forEach((control) => control.classList.add("is-invalid"));

    const uniqueInvalidControls = invalidControls.filter((control, index, array) => {
        return array.findIndex((candidate) => candidate.name === control.name) === index;
    });

    if (!uniqueInvalidControls.length) {
        return true;
    }

    state.navigation.querySelector("[data-wizard-message]").textContent = "Preencha os campos obrigatórios desta etapa para continuar.";
    uniqueInvalidControls[0].focus();
    return false;
}

function atualizarWizardFormulario(formElement) {
    const state = wizardStates.get(formElement);

    if (!state) {
        return;
    }

    const totalSteps = state.steps.length;
    const lastStep = state.currentStep === totalSteps - 1;
    const completion = calcularProgressoFormulario(formElement);
    const currentStep = state.steps[state.currentStep];
    const toolbar = state.toolbar;
    const navigation = state.navigation;
    const nextButton = navigation.querySelector("[data-wizard-next]");

    toolbar.querySelector("[data-wizard-eyebrow]").textContent = `Etapa ${state.currentStep + 1} de ${totalSteps}`;
    toolbar.querySelector("[data-wizard-title]").textContent = currentStep.title;
    toolbar.querySelector("[data-wizard-percent]").textContent = `${completion}% preenchido`;
    toolbar.querySelector("[data-wizard-progress]").style.width = `${completion}%`;

    toolbar.querySelectorAll("[data-wizard-step]").forEach((buttonStep, index) => {
        buttonStep.classList.toggle("is-active", index === state.currentStep);
        buttonStep.classList.toggle("is-complete", calcularProgressoEtapa(state.steps[index]) === 100);
    });

    navigation.querySelector("[data-wizard-prev]").disabled = state.currentStep === 0;
    navigation.querySelector("[data-wizard-position]").textContent = `${state.currentStep + 1} / ${totalSteps}`;
    navigation.querySelector("[data-wizard-message]").textContent = "";
    nextButton.classList.toggle("is-hidden", lastStep);
    state.actions?.classList.toggle("wizard-actions-hidden", !lastStep);

    atualizarPreviewDocumento(state);
}

function calcularProgressoFormulario(formElement) {
    return calcularProgressoControles(Array.from(formElement.elements));
}

function calcularProgressoEtapa(step) {
    return calcularProgressoControles(obterControlesEtapa(step));
}

function calcularProgressoControles(controls) {
    const requiredControls = controls.filter((control) => control.required && controleParticipaDoFormulario(control));
    const uniqueControls = requiredControls.filter((control, index, array) => {
        return array.findIndex((candidate) => candidate.name === control.name) === index;
    });

    if (!uniqueControls.length) {
        return 100;
    }

    const filled = uniqueControls.filter((control) => {
        if (control.type === "radio") {
            return control.form?.querySelector(`[name="${control.name}"]:checked`);
        }

        if (control.type === "checkbox") {
            return control.checked;
        }

        return String(control.value || "").trim();
    }).length;

    return Math.round((filled / uniqueControls.length) * 100);
}

function obterControlesEtapa(step) {
    return step.elements.flatMap((element) => {
        if (element.matches("input, select, textarea")) {
            return [element];
        }

        return Array.from(element.querySelectorAll("input, select, textarea"));
    });
}

function controleParticipaDoFormulario(control) {
    return !control.disabled &&
        control.type !== "hidden" &&
        !control.closest(".conditional-fields.is-hidden, .repeatable-entry.is-hidden, .spouse-section.is-hidden, [aria-hidden='true']");
}

function atualizarPreviewDocumento(state) {
    const values = state.preview.querySelector("[data-live-preview-values]");
    const entries = [];
    const usedNames = new Set();

    Array.from(state.form.elements).forEach((control) => {
        if (!control.name || usedNames.has(control.name) || !controleParticipaDoFormulario(control)) {
            return;
        }

        let value = String(control.value || "").trim();

        if (control.type === "radio") {
            const selected = state.form.querySelector(`[name="${control.name}"]:checked`);

            if (!selected) {
                return;
            }

            value = selected.value;
        }

        if (control.type === "checkbox") {
            if (!control.checked) {
                return;
            }

            value = "Marcado";
        }

        if (!value) {
            return;
        }

        usedNames.add(control.name);
        entries.push({
            label: obterRotuloControle(control),
            value,
        });
    });

    if (!entries.length) {
        values.innerHTML = '<div class="live-preview-empty">Comece a preencher os campos para visualizar um resumo do documento.</div>';
        return;
    }

    const visibleEntries = entries.slice(0, 8);
    values.innerHTML = visibleEntries.map((entry) => `
        <div>
            <dt>${escaparHtmlSeguro(entry.label)}</dt>
            <dd>${escaparHtmlSeguro(entry.value)}</dd>
        </div>
    `).join("");

    if (entries.length > visibleEntries.length) {
        values.insertAdjacentHTML("beforeend", `<p class="live-preview-more">+ ${entries.length - visibleEntries.length} campos preenchidos</p>`);
    }
}

function obterRotuloControle(control) {
    return control.closest("label")?.querySelector("span")?.textContent.trim() ||
        control.closest("fieldset")?.querySelector("legend")?.textContent.trim() ||
        control.name.replaceAll("_", " ");
}

function resumirTituloEtapa(title) {
    return title
        .replace(/^\d+(?:\.\d+)?\.?\s*/, "")
        .replace(/^dados (do|da|dos|das)\s+/i, "")
        .trim();
}

function escaparHtmlSeguro(text) {
    return String(text || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function carregarAppReleaseUsuario() {
    if (!appUpdateCard) {
        return;
    }

    renderizarAppReleaseUsuario(null, { loading: true });

    try {
        const data = await apiRequest("/api/app-release");
        renderizarAppReleaseUsuario(data.release);
    } catch (error) {
        renderizarAppReleaseUsuario(null, { error: traduzirErroApi(error) });
    }
}

function renderizarAppReleaseUsuario(release, state = {}) {
    if (!appUpdateCard || !appUpdateVersion || !appUpdateMessage || !appUpdateDownloadLink) {
        return;
    }

    if (state.loading) {
        appUpdateVersion.textContent = "Consultando atualização...";
        appUpdateMessage.textContent = "Aguarde enquanto buscamos a versão mais recente.";
        appUpdateDate.textContent = "";
        appUpdateDownloadLink.classList.add("is-hidden");
        appUpdateDownloadLink.removeAttribute("href");
        return;
    }

    if (state.error) {
        appUpdateVersion.textContent = "Não foi possível consultar";
        appUpdateMessage.textContent = state.error;
        appUpdateDate.textContent = "";
        appUpdateDownloadLink.classList.add("is-hidden");
        appUpdateDownloadLink.removeAttribute("href");
        return;
    }

    if (!release) {
        appUpdateVersion.textContent = "Nenhuma atualização publicada";
        appUpdateMessage.textContent = "Quando uma nova versão Android estiver disponível, ela aparecerá aqui.";
        appUpdateDate.textContent = "";
        appUpdateDownloadLink.classList.add("is-hidden");
        appUpdateDownloadLink.removeAttribute("href");
        return;
    }

    appUpdateVersion.textContent = release.versionName ? `Versão ${release.versionName}` : "Nova versão disponível";
    appUpdateMessage.textContent = release.message || "Nova atualização disponível.";
    appUpdateDate.textContent = release.createdAt ? `Publicado em ${formatarDataHora(release.createdAt)}` : "";
    appUpdateDownloadLink.href = release.downloadUrl || "#";
    appUpdateDownloadLink.classList.toggle("is-hidden", !release.downloadUrl);
    inicializarIcones();
}

function abrirPainelAdmin() {
    if (!usuarioAtualEhAdmin) {
        return;
    }

    limparMensagemAdmin();
    mostrarTela("admin");
    carregarUsuariosAdmin();
    carregarAtendimentosAdmin();
    carregarAppReleaseAdmin();
}

function validarFormularioAdmin() {
    const editando = Boolean(adminEditingUid.value);
    const campos = [
        adminUserName,
        adminUserEmail,
        adminUserPlan,
        adminUserStatus,
        adminUserDailyDocumentLimit,
        adminUserDailyQuotaRenewal,
        adminUserPdfTools,
        adminUserPdfToolDailyLimit,
        adminUserPdfToolQuotaRenewal,
    ].filter(Boolean);

    if (!editando || adminUserPassword.value.trim()) {
        campos.push(adminUserPassword);
    }
    const campoInvalido = campos.find((campo) => {
        const invalido = campo.value.trim() === "" || !campo.validity.valid;
        campo.classList.toggle("is-invalid", invalido);
        campo.setAttribute("aria-invalid", String(invalido));
        return invalido;
    });

    if (campoInvalido) {
        mostrarMensagemAdmin("Preencha nome, e-mail válido, senha com no mínimo 6 caracteres, plano e status.", "error");
        campoInvalido.focus();
        return false;
    }

    if (!adminAllowAllDocuments.checked && obterDocumentosLiberadosAdmin().length === 0) {
        mostrarMensagemAdmin("Selecione pelo menos um documento ou marque para liberar todos.", "error");
        adminDocumentAccessList?.querySelector("[data-admin-document-access]")?.focus();
        return false;
    }

    return true;
}

async function carregarUsuariosAdmin() {
    if (!usuarioAtualEhAdmin) {
        return;
    }

    adminUsersList.innerHTML = '<div class="empty-state">Carregando usuários...</div>';

    try {
        const data = await apiRequest("/api/admin/users");
        const usuarios = data.users || [];
        adminUsersCache = Object.fromEntries(usuarios.map((usuario) => [usuario.id, usuario]));
        renderizarUsuariosAdmin(usuarios);
    } catch (error) {
        console.error(error);
        adminUsersList.innerHTML = '<div class="empty-state">Não foi possível carregar os usuários.</div>';
    }
}

async function carregarAtendimentosAdmin() {
    if (!usuarioAtualEhAdmin) {
        return;
    }

    adminSupportList.innerHTML = '<div class="empty-state">Carregando atendimentos...</div>';

    try {
        const data = await apiRequest("/api/admin/support/messages");
        renderizarAtendimentosAdmin(data.messages || []);
    } catch (error) {
        adminSupportList.innerHTML = `<div class="empty-state">${escaparHtmlSeguro(traduzirErroApi(error))}</div>`;
    }
}

async function carregarAppReleaseAdmin() {
    if (!usuarioAtualEhAdmin || !adminApkCurrent) {
        return;
    }

    adminApkCurrent.innerHTML = "<p>Consultando aviso de atualização...</p>";

    try {
        const data = await apiRequest("/api/admin/app-release");
        renderizarAppReleaseAdmin(data.release);
    } catch (error) {
        adminApkCurrent.innerHTML = `<p>${escaparHtmlSeguro(traduzirErroApi(error))}</p>`;
    }
}

function renderizarAppReleaseAdmin(release) {
    if (!adminApkCurrent) {
        return;
    }

    if (!release) {
        adminApkCurrent.innerHTML = "<p>Nenhum aviso de atualização publicado ainda.</p>";
        adminApkDeleteButton?.classList.add("is-hidden");
        return;
    }

    adminApkDeleteButton?.classList.remove("is-hidden");
    adminApkCurrent.innerHTML = `
        <article class="admin-apk-release-card">
            <span class="admin-apk-release-icon"><i data-lucide="smartphone" aria-hidden="true"></i></span>
            <div>
                <strong>${escaparHtmlSeguro(release.versionName ? `Versão ${release.versionName}` : "Nova atualização disponível")}</strong>
                <small>${[
                    release.downloadUrl || "",
                    release.createdAt ? formatarDataHora(release.createdAt) : "",
                ].filter(Boolean).map(escaparHtmlSeguro).join(" | ")}</small>
                ${release.message ? `<p>${escaparHtmlSeguro(release.message)}</p>` : ""}
            </div>
        </article>
    `;
    inicializarIcones();
}

async function enviarApkAdmin(event) {
    event.preventDefault();
    mostrarMensagemApkAdmin("");

    if (!usuarioAtualEhAdmin) {
        mostrarMensagemApkAdmin("Apenas administradores podem publicar atualizações.", "error");
        return;
    }

    try {
        alternarApkAdminCarregamento(true);
        const data = await apiRequest("/api/admin/app-release", {
            method: "POST",
            body: {
                versionName: adminApkVersion?.value.trim() || "",
                downloadUrl: adminApkDownloadUrl?.value.trim() || "",
                message: adminApkNotes?.value.trim() || "",
            },
        });

        adminApkUploadForm.reset();
        renderizarAppReleaseAdmin(data.release);
        mostrarMensagemApkAdmin(data.message || "Aviso de atualização publicado.", "success");
    } catch (error) {
        mostrarMensagemApkAdmin(traduzirErroApi(error), "error");
    } finally {
        alternarApkAdminCarregamento(false);
    }
}

async function excluirApkAdmin() {
    mostrarMensagemApkAdmin("");

    if (!usuarioAtualEhAdmin) {
        mostrarMensagemApkAdmin("Apenas administradores podem remover avisos de atualização.", "error");
        return;
    }

    const confirmar = window.confirm("Remover o aviso de atualização publicado?");

    if (!confirmar) {
        return;
    }

    try {
        alternarApkAdminCarregamento(true);
        const data = await apiRequest("/api/admin/app-release", { method: "DELETE" });
        renderizarAppReleaseAdmin(null);
        mostrarMensagemApkAdmin(data.message || "Aviso de atualização removido.", "success");
    } catch (error) {
        mostrarMensagemApkAdmin(traduzirErroApi(error), "error");
    } finally {
        alternarApkAdminCarregamento(false);
    }
}

function mostrarMensagemApkAdmin(texto, tipo) {
    if (!adminApkMessage) {
        return;
    }

    adminApkMessage.textContent = texto || "";
    adminApkMessage.className = `message ${tipo || ""}`.trim();
}

function alternarApkAdminCarregamento(carregando) {
    if (adminApkButton) {
        adminApkButton.disabled = carregando;
        adminApkButton.textContent = carregando ? "Publicando..." : "Publicar atualização";
    }

    if (adminApkDeleteButton) {
        adminApkDeleteButton.disabled = carregando;
    }
}

function renderizarAtendimentosAdmin(messages) {
    if (!messages.length) {
        adminSupportList.innerHTML = '<div class="empty-state">Nenhuma mensagem ou comprovante recebido.</div>';
        return;
    }

    const conversations = messages.reduce((groups, item) => {
        const email = item.customerEmail || "sem-email";
        groups[email] ||= [];
        groups[email].push(item);
        return groups;
    }, {});

    adminSupportList.innerHTML = Object.entries(conversations).map(([email, items]) => {
        const latest = items[0];
        const customerName = latest.customerName || "Cliente";
        const messagesHtml = items.map((item) => `
            <article class="admin-support-message ${item.senderType === "admin" ? "is-admin" : "is-customer"}">
                <div class="admin-support-message-heading">
                    <strong>${item.senderType === "admin" ? "Administrador" : "Cliente"}</strong>
                    <time>${formatarDataHora(item.createdAt)}</time>
                </div>
                ${item.category === "payment_proof" ? `<span class="support-category-pill">Comprovante: ${escaparHtmlSeguro(obterNomePlanoPorId(item.plan))}</span>` : ""}
                ${item.message ? `<p>${escaparHtmlSeguro(item.message)}</p>` : ""}
                ${item.attachmentName ? `<button type="button" class="secondary-button support-download-button" data-support-download="${escaparHtmlSeguro(item.id)}" data-attachment-name="${escaparHtmlSeguro(item.attachmentName)}"><i data-lucide="download" aria-hidden="true"></i><span>${escaparHtmlSeguro(item.attachmentName)}</span></button>` : ""}
            </article>
        `).join("");

        return `
            <details class="admin-support-conversation">
                <summary>
                    <span class="admin-support-avatar"><i data-lucide="user-round" aria-hidden="true"></i></span>
                    <span><strong>${escaparHtmlSeguro(customerName)}</strong><small>${escaparHtmlSeguro(email)}</small></span>
                    <span class="admin-support-count">${items.length}</span>
                </summary>
                <div class="admin-support-thread">
                    ${messagesHtml}
                    <button type="button" class="secondary-button admin-support-reply" data-support-reply="${escaparHtmlSeguro(email)}" data-customer-name="${escaparHtmlSeguro(customerName)}"><i data-lucide="reply" aria-hidden="true"></i><span>Responder</span></button>
                </div>
            </details>
        `;
    }).join("");
    inicializarIcones();
}

async function enviarRespostaAdmin(email, name, message) {
    try {
        await apiRequest("/api/admin/support/messages", {
            method: "POST",
            body: { email, name, message },
        });
        await carregarAtendimentosAdmin();
    } catch (error) {
        window.alert(traduzirErroApi(error));
    }
}

async function baixarAnexoAtendimento(id, filename) {
    try {
        const headers = new Headers();
        const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);

        if (sessionToken) {
            headers.set("Authorization", `Bearer ${sessionToken}`);
        }

        const response = await fetch(montarUrlApi(`/api/support/attachments/${id}`), { headers, credentials: "include" });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Não foi possível baixar o comprovante.");
        }

        window.saveAs(await response.blob(), filename || "comprovante");
    } catch (error) {
        window.alert(error.message || "Não foi possível baixar o comprovante.");
    }
}

function renderizarUsuariosAdmin(usuarios) {
    const entradas = usuarios
        .map((usuario) => [usuario.id, usuario])
        .sort(([, a], [, b]) => String(a.email || "").localeCompare(String(b.email || "")));

    if (entradas.length === 0) {
        adminUsersList.innerHTML = '<div class="empty-state">Nenhum usuário cadastrado ainda.</div>';
        return;
    }

    adminUsersList.textContent = "";

    entradas.forEach(([uid, usuario]) => {
        const status = obterStatusVisual(usuario);
        const item = document.createElement("article");
        item.className = "admin-user-item";

        const identity = document.createElement("div");
        identity.className = "admin-user-identity";
        const avatar = document.createElement("span");
        avatar.className = "admin-user-avatar";
        avatar.innerHTML = '<i data-lucide="user-round" aria-hidden="true"></i>';
        const info = document.createElement("div");
        const nomeLinha = document.createElement("span");
        nomeLinha.className = "verified-name-line";
        const nome = document.createElement("strong");
        nome.textContent = usuario.name || "Usuário sem nome";
        nomeLinha.appendChild(nome);

        if (usuario.isVerified) {
            nomeLinha.appendChild(criarSeloVerificado());
        }

        const meta = document.createElement("div");
        meta.className = "admin-user-meta";
        meta.append(
            criarTextoMeta(usuario.email || "sem e-mail"),
            criarPlanoAtualAdmin(usuario),
            criarTextoMeta(`Vence em ${formatarVencimento(usuario)}`),
            criarStatus(status)
        );

        if (["test3min", "test10c", "basic30"].includes(normalizePlanId(usuario.plan))) {
            meta.append(criarTextoMeta(`Limite diário: ${usuario.dailyDocumentLimit || 5} por documento`));
            meta.append(criarTextoMeta(usuario.dailyQuotaRenewalEnabled === false
                ? "Renovação diária: desligada"
                : "Renovação diária: + saldo às 04:00"));
        }

        if (usuario.allowLiquidGlass) {
            meta.append(criarTextoMeta("Tema Liquid Glass liberado"));
        }

        const documentosLiberados = normalizarListaDocumentosLiberados(usuario.allowedDocumentTypes);
        meta.append(criarTextoMeta(documentosLiberados.length ? `Documentos liberados: ${documentosLiberados.length}` : "Documentos: todos"));

        if (usuario.isAdmin) {
            meta.append(criarTextoMeta("Administrador"));
        }

        if (usuario.notes) {
            meta.append(criarTextoMeta(usuario.notes));
        }

        info.append(nomeLinha, meta);
        identity.append(avatar, info);

        const actions = document.createElement("div");
        actions.className = "admin-user-actions";
        actions.append(
            criarBotaoAdmin(uid, "edit", "Editar"),
            criarBotaoAdmin(uid, "history", "Histórico"),
            criarBotaoAdmin(uid, "renewCurrent", "Renovar plano"),
            criarBotaoAdmin(uid, status.status === "blocked" ? "unblock" : "block", status.status === "blocked" ? "Liberar" : "Bloquear")
        );

        item.append(identity, actions);
        adminUsersList.appendChild(item);
    });

    inicializarIcones();
}

function criarTextoMeta(texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    return span;
}

function atualizarSeloAoLadoDoNome(elementoNome, usuario) {
    elementoNome.parentElement?.querySelector("[data-verified-badge]")?.remove();

    if (usuario?.isVerified) {
        elementoNome.insertAdjacentElement("afterend", criarSeloVerificado());
    }
}

function criarSeloVerificado() {
    const selo = document.createElement("span");
    selo.className = "verified-badge";
    selo.dataset.verifiedBadge = "true";
    selo.title = "Perfil verificado";
    selo.setAttribute("aria-label", "Perfil verificado");
    selo.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path class="verified-badge-medallion" d="M23 12l-2.44-2.79.39-3.69-3.61-.82L15.45 1.5 12 2.96 8.55 1.5 6.66 4.69l-3.61.82.39 3.69L1 12l2.44 2.79-.39 3.69 3.61.82 1.89 3.19L12 21.04l3.45 1.46 1.89-3.19 3.61-.82-.39-3.69L23 12z"></path>
            <path class="verified-badge-check" d="m8.5 12.1 2.15 2.15 4.85-4.85"></path>
        </svg>
    `;
    return selo;
}

function criarPlanoAtualAdmin(usuario) {
    const span = document.createElement("span");
    span.className = `plan-pill ${obterClassePlano(usuario.plan)}`;
    span.textContent = getPlan(usuario.plan)?.label || usuario.planLabel || "Sem plano";
    return span;
}

function criarStatus(status) {
    const span = document.createElement("span");
    span.className = `status-pill status-pill-${status.status}`;
    span.textContent = status.label;
    return span;
}

function criarBotaoAdmin(uid, action, text) {
    const icones = {
        edit: "pencil",
        history: "history",
        renewCurrent: "refresh-cw",
        block: "lock",
        unblock: "lock-open",
    };
    const buttonAction = document.createElement("button");
    buttonAction.type = "button";
    buttonAction.className = "secondary-button";
    buttonAction.dataset.uid = uid;
    buttonAction.dataset.adminAction = action;
    buttonAction.innerHTML = `<i data-lucide="${icones[action] || "circle"}" aria-hidden="true"></i><span>${text}</span>`;
    return buttonAction;
}

function preencherFormularioAdminEdicao(uid) {
    const usuario = adminUsersCache[uid];

    if (!usuario) {
        mostrarMensagemAdmin("Usuario nao encontrado na lista. Atualize e tente novamente.", "error");
        return;
    }

    adminEditingUid.value = uid;
    adminFormTitle.textContent = "Editar login";
    adminAccessButton.textContent = "Salvar alteracoes";
    adminUserPassword.required = false;
    adminUserPassword.value = "";
    adminUserPassword.placeholder = "Preencha apenas se quiser trocar a senha";
    adminUserName.value = usuario.name || "";
    adminUserEmail.value = usuario.email || "";
    adminUserPlan.value = normalizePlanId(usuario.plan || "basic30");
    adminUserStatus.value = usuario.status === "blocked" ? "blocked" : "active";
    adminUserDailyDocumentLimit.value = String(usuario.dailyDocumentLimit || 5);
    adminUserDailyQuotaRenewal.value = usuario.dailyQuotaRenewalEnabled === false ? "no" : "yes";
    adminUserPdfTools.value = usuario.allowPdfTools ? "yes" : "no";
    adminUserPdfToolDailyLimit.value = String(usuario.pdfToolDailyLimit || 5);
    adminUserPdfToolQuotaRenewal.value = usuario.pdfToolQuotaRenewalEnabled === false ? "no" : "yes";
    adminUserVerified.value = usuario.isVerified ? "yes" : "no";
    adminUserLiquidGlass.value = usuario.allowLiquidGlass ? "yes" : "no";
    adminUserQuotaDocument.value = "";
    adminUserQuotaAddAmount.value = "5";
    adminUserPdfToolOperation.value = "";
    adminUserPdfToolQuotaAmount.value = "5";
    aplicarDocumentosLiberadosAdmin(usuario.allowedDocumentTypes);
    adminUserNotes.value = usuario.notes || "";
    limparMensagemAdmin();
    carregarResumoSaldoUsuarioAdmin(uid);
    carregarResumoPdfUsuarioAdmin(uid);
    adminAccessForm.scrollIntoView({ behavior: "smooth", block: "start" });
    adminUserName.focus();
}

function limparFormularioAdmin() {
    adminAccessForm.reset();
    adminEditingUid.value = "";
    adminFormTitle.textContent = "Criar novo login";
    adminAccessButton.textContent = "Criar login";
    adminUserPassword.required = true;
    adminUserPassword.placeholder = "";
    adminUserDailyQuotaRenewal.value = "yes";
    adminUserQuotaDocument.value = "";
    adminUserQuotaAddAmount.value = "5";
    adminUserPdfTools.value = "no";
    adminUserPdfToolDailyLimit.value = "5";
    adminUserPdfToolQuotaRenewal.value = "yes";
    adminUserPdfToolOperation.value = "";
    adminUserPdfToolQuotaAmount.value = "5";
    adminUserLiquidGlass.value = "no";
    aplicarDocumentosLiberadosAdmin([]);
    renderizarResumoSaldoAdmin(null);
    renderizarResumoPdfAdmin(null);
}

function obterStatusVisual(usuario) {
    if (usuario.status === "blocked") {
        return {
            status: "blocked",
            label: "Bloqueado",
        };
    }

    if (usuario.status === "expired" || !usuario.expiresAt || new Date(usuario.expiresAt).getTime() <= Date.now()) {
        return {
            status: "expired",
            label: "Vencido",
        };
    }

    return {
        status: "active",
        label: "Ativo",
    };
}

function montarMensagemPlano(registro) {
    const plano = getPlan(registro.plan) || {
        label: registro.planLabel || "plano ativo",
    };
    const vencimento = new Date(registro.expiresAt);

    if (plano.minutes) {
        const minutosRestantes = Math.max(
            1,
            Math.ceil((vencimento.getTime() - Date.now()) / (1000 * 60))
        );
        const textoMinutos = minutosRestantes === 1
            ? "1 minuto restante"
            : `${minutosRestantes} minutos restantes`;

        return `Parabéns! Você está com o ${plano.label.toLowerCase()} ativo. Vence em ${formatarDataHora(registro.expiresAt)} (${textoMinutos}).`;
    }

    const diasRestantes = Math.max(
        1,
        Math.ceil((vencimento.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
    const textoDias = diasRestantes === 1 ? "1 dia restante" : `${diasRestantes} dias restantes`;

    return `Parabéns! Seu ${String(plano.label).toLowerCase()} está ativo. Vence em ${formatarData(registro.expiresAt)} (${textoDias}).`;
}

function atualizarAcoesPlano() {
    const podeMostrar = Boolean(usuarioAtual?.plan);
    planActions.classList.toggle("is-hidden", !podeMostrar);
    atualizarBotoesGeracaoPorPlano();
    atualizarCartaoPdfLocal();
}

function atualizarBotoesGeracaoPorPlano() {
    const ocultarDownloadWord = usuarioAtualTemPlanoBasicoSemWord();

    button.style.display = ocultarDownloadWord ? "none" : "";
    simpleDocumentButton.style.display = ocultarDownloadWord ? "none" : "";
}

function usuarioAtualTemPlanoBasicoSemWord() {
    return !usuarioAtualEhAdmin
        && !usuarioAtual?.isVerified
        && normalizePlanId(usuarioAtual?.plan) === "basic30";
}

function usuarioAtualTemPlanoBasico() {
    return usuarioAtualTemPlanoBasicoSemWord();
}

function abrirRenovacaoPlano() {
    const user = usuarioAtual || billingUser;

    if (!user?.plan) {
        return;
    }

    abrirConfirmacaoPagamento(normalizePlanId(user.plan), "renovar");
}

function abrirAlteracaoPlano() {
    const user = usuarioAtual || billingUser;

    if (!user?.plan) {
        return;
    }

    pagamentoModoAtual = "alterar";
    pagamentoPlanoSelecionado = "";
    paymentTitle.textContent = "Alterar plano";
    paymentDescription.textContent = "Escolha um dos planos pagos disponiveis.";
    paymentPlanOptions.textContent = "";
    paymentConfirmBox.classList.add("is-hidden");
    paymentQrBox.classList.add("is-hidden");

    const planoAtual = normalizePlanId(user.plan);
    const planosDisponiveis = CUSTOMER_CHANGE_PLAN_IDS.filter((planId) => planId !== planoAtual);

    if (planosDisponiveis.length === 0) {
        paymentDescription.textContent = "Seu plano atual já é o plano máximo disponível.";
    }

    planosDisponiveis.forEach((planId) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `payment-plan-option ${obterClassePlano(planId)}`;
        button.textContent = `${obterNomePlanoPorId(planId)} - ${obterPrecoPlano(planId)}`;
        button.addEventListener("click", () => abrirConfirmacaoPagamento(planId, "alterar"));
        paymentPlanOptions.appendChild(button);
    });

    abrirModalPagamento();
}

function abrirConfirmacaoPagamento(planId, modo) {
    pagamentoPlanoSelecionado = normalizePlanId(planId);
    pagamentoModoAtual = modo;
    paymentTitle.textContent = modo === "renovar" ? "Renovar plano" : "Alterar plano";
    paymentDescription.textContent = modo === "renovar"
        ? `Plano atual: ${obterNomePlanoPorId(pagamentoPlanoSelecionado)}.`
        : `Novo plano selecionado: ${obterNomePlanoPorId(pagamentoPlanoSelecionado)}.`;
    paymentPlanOptions.textContent = "";
    paymentQrBox.classList.add("is-hidden");
    paymentPixCodeField?.classList.add("is-hidden");
    paymentPixCodeField?.setAttribute("aria-hidden", "true");
    paymentConfirmBox.classList.remove("is-hidden");
    paymentConfirmText.textContent = `Deseja seguir para o pagamento de ${obterPrecoPlano(pagamentoPlanoSelecionado)} e ${modo === "renovar" ? "renovar" : "alterar para"} o plano ${obterNomePlanoPorId(pagamentoPlanoSelecionado)} automaticamente?`;
    paymentShowQrButton.textContent = "Gerar Pix";
    abrirModalPagamento();
}

async function iniciarPagamentoMercadoPago() {
    if (!pagamentoPlanoSelecionado) {
        return;
    }

    paymentProofMessage.textContent = "";
    paymentProofMessage.className = "message";
    paymentShowQrButton.disabled = true;
    paymentShowQrButton.textContent = "Gerando Pix...";

    try {
        await desmontarMercadoPagoBrick();
        paymentMercadoPagoLink.removeAttribute("href");
        paymentMercadoPagoLink.classList.add("is-hidden");
        paymentPixCode.value = "";
        paymentPixCodeField?.classList.add("is-hidden");
        paymentPixCodeField?.setAttribute("aria-hidden", "true");

        const data = await apiRequest("/api/billing/pix", {
            method: "POST",
            body: {
                plan: pagamentoPlanoSelecionado,
                mode: pagamentoModoAtual || "renovar",
            },
        });

        pagamentoAtualId = data.payment?.id || "";
        paymentConfirmBox.classList.add("is-hidden");
        paymentQrBox.classList.remove("is-hidden");
        paymentPlanSummary.textContent = `${obterNomePlanoPorId(pagamentoPlanoSelecionado)} - ${obterPrecoPlano(pagamentoPlanoSelecionado)}`;
        renderizarStatusPagamento(data);
        renderizarPixPagamento(data);
        paymentProofMessage.textContent = data.message || "Pix gerado. Pague pelo QR Code ou copie o codigo Pix.";
        paymentProofMessage.className = "message success";
    } catch (error) {
        const message = traduzirErroApi(error);
        paymentProofMessage.textContent = message;
        paymentProofMessage.className = "message error";
        renderizarStatusPagamento({ status: "error", message });
    } finally {
        paymentShowQrButton.disabled = false;
        paymentShowQrButton.textContent = "Gerar Pix";
    }
}

function renderizarPixPagamento(data = {}) {
    const pix = data.pix || {};
    const qrCode = String(pix.qrCode || "").trim();
    const qrCodeImage = String(pix.qrCodeImage || pix.qrCodeBase64 || "").trim();

    paymentQrPlaceholder.classList.remove("is-hidden");

    if (qrCodeImage) {
        paymentQrPlaceholder.innerHTML = `
            <img src="${escaparHtmlSeguro(qrCodeImage)}" alt="QR Code Pix para pagamento">
            <strong>Escaneie para pagar</strong>
            <span>Abra o aplicativo do seu banco, escolha Pix e escaneie este QR Code.</span>
        `;
    } else {
        paymentQrPlaceholder.innerHTML = `
            <i data-lucide="qr-code" aria-hidden="true"></i>
            <strong>Pix gerado</strong>
            <span>Use o codigo copia e cola abaixo para concluir o pagamento.</span>
        `;
        inicializarIcones();
    }

    if (qrCode) {
        paymentPixCode.value = qrCode;
        paymentPixCodeField?.classList.remove("is-hidden");
        paymentPixCodeField?.setAttribute("aria-hidden", "false");
        paymentCopyPixButton.disabled = false;
        paymentCopyPixButton.classList.remove("is-hidden");
    } else {
        paymentPixCode.value = "";
        paymentPixCodeField?.classList.add("is-hidden");
        paymentPixCodeField?.setAttribute("aria-hidden", "true");
        paymentCopyPixButton.disabled = true;
    }

    if (paymentVerifyButton) {
        paymentVerifyButton.disabled = false;
        paymentVerifyButton.classList.remove("is-hidden");
    }
}

async function copiarCodigoPixAtual() {
    const codigo = String(paymentPixCode?.value || "").trim();

    if (!codigo) {
        paymentProofMessage.textContent = "Gere o Pix primeiro para copiar o codigo.";
        paymentProofMessage.className = "message error";
        return;
    }

    try {
        await navigator.clipboard.writeText(codigo);
        paymentProofMessage.textContent = "Codigo Pix copiado. Cole no aplicativo do seu banco para pagar.";
        paymentProofMessage.className = "message success";
    } catch (error) {
        paymentPixCode.focus();
        paymentPixCode.select();
        paymentProofMessage.textContent = "Não foi possível copiar automaticamente. Selecione e copie o codigo Pix manualmente.";
        paymentProofMessage.className = "message";
    }
}


async function renderizarMercadoPagoBrick(data = {}) {
    if (!paymentBrickContainer) {
        return;
    }

    const publicKey = String(data.publicKey || "").trim();
    const preferenceId = String(data.preferenceId || data.payment?.mercadoPagoPreferenceId || "").trim();
    const amount = Number(data.payment?.amount || PAYMENT_PLANS[pagamentoPlanoSelecionado]?.amount || 0);

    if (!publicKey || !amount || !window.MercadoPago) {
        return;
    }

    await desmontarMercadoPagoBrick();

    paymentQrPlaceholder.classList.add("is-hidden");
    paymentBrickContainer.classList.remove("is-hidden");
    paymentBrickStatus.classList.remove("is-hidden");
    paymentBrickStatus.textContent = "Carregando checkout seguro dentro do DocSpace...";
    paymentBrickContainer.innerHTML = "";

    try {
        mercadoPagoInstance = new MercadoPago(publicKey, { locale: "pt-BR" });
        const bricksBuilder = mercadoPagoInstance.bricks();

        const settings = {
            initialization: {
                amount,
                ...(preferenceId ? { preferenceId } : {}),
            },
            customization: {
                paymentMethods: {
                    creditCard: "all",
                    debitCard: "all",
                    bankTransfer: "all",
                    ticket: "all",
                    prepaidCard: "all",
                },
            },
            callbacks: {
                onReady: () => {
                    paymentBrickStatus.textContent = "Escolha Pix, cartão ou boleto e finalize o pagamento aqui mesmo.";
                },
                onSubmit: ({ selectedPaymentMethod, formData }) => new Promise(async (resolve, reject) => {
                    try {
                        paymentBrickStatus.textContent = "Enviando pagamento para o Mercado Pago...";
                        const result = await apiRequest("/api/billing/brick-payment", {
                            method: "POST",
                            body: {
                                paymentId: pagamentoAtualId,
                                selectedPaymentMethod,
                                formData,
                            },
                        });

                        if (result.payment?.id) {
                            pagamentoAtualId = result.payment.id;
                        }

                        renderizarStatusPagamento(result);
                        aplicarResultadoPagamentoAprovado(result);
                        paymentProofMessage.textContent = result.message || "Pagamento enviado. Aguarde a confirmação automática.";
                        paymentProofMessage.className = result.payment?.status === "approved" ? "message success" : "message";
                        paymentBrickStatus.textContent = result.payment?.status === "approved"
                            ? "Pagamento aprovado. Plano liberado."
                            : "Pagamento recebido. Se for Pix/boleto, aguarde a confirmação.";
                        resolve();
                    } catch (error) {
                        const message = traduzirErroApi(error);
                        paymentProofMessage.textContent = message;
                        paymentProofMessage.className = "message error";
                        paymentBrickStatus.textContent = message;
                        reject(error);
                    }
                }),
                onError: (error) => {
                    console.error("ERRO MERCADO PAGO BRICK:", error);
                    console.error("ERRO MERCADO PAGO BRICK JSON:", JSON.stringify(error, null, 2));
                    paymentProofMessage.textContent = `Erro ao carregar checkout: ${error?.message || "ver console do navegador"}`;
                }
            },
        };

        paymentBrickController = await bricksBuilder.create("payment", "paymentBrickContainer", settings);
        window.paymentBrickController = paymentBrickController;
    } catch (error) {
        console.error("Erro ao renderizar Payment Brick:", error);
        paymentBrickStatus.textContent = "Não foi possível abrir o pagamento dentro do site.";
        paymentQrPlaceholder.classList.remove("is-hidden");
        paymentBrickContainer.classList.add("is-hidden");
        if (data.checkoutUrl) {
            paymentMercadoPagoLink.href = data.checkoutUrl;
            paymentMercadoPagoLink.classList.remove("is-hidden");
        }
    }
}

async function desmontarMercadoPagoBrick() {
    if (paymentBrickController?.unmount) {
        try {
            await paymentBrickController.unmount();
        } catch (error) {
            console.warn("Não foi possível desmontar o Payment Brick:", error);
        }
    }

    paymentBrickController = null;
    if (window.paymentBrickController) {
        window.paymentBrickController = null;
    }

    if (paymentBrickContainer) {
        paymentBrickContainer.innerHTML = "";
        paymentBrickContainer.classList.add("is-hidden");
    }

    if (paymentBrickStatus) {
        paymentBrickStatus.textContent = "";
        paymentBrickStatus.classList.add("is-hidden");
    }

    paymentQrPlaceholder?.classList.remove("is-hidden");
}

function aplicarResultadoPagamentoAprovado(data = {}) {
    if (data.sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
        localStorage.removeItem(BILLING_TOKEN_KEY);
    }

    if (data.user) {
        billingUser = null;
        usuarioAtual = data.user;
        usuarioAtualEhAdmin = Boolean(data.user.isAdmin);
        atualizarUsuario(data.user);
        atualizarAcoesPlano();
        fecharAvisoAcessoBloqueado();
    }
}

function renderizarStatusPagamento(data = {}) {
    const status = data.payment?.status || data.status || "pending";
    const statusText = status === "approved" ? "Pagamento aprovado"
        : status === "configured" ? "Pagamento pronto"
        : status === "error" ? "Falha na integração"
        : data.integrationPending ? "Configuração pendente"
        : "Aguardando pagamento";
    const description = data.integrationPending
        ? "A tela já está preparada. Agora falta configurar o token do Mercado Pago no backend."
        : data.pix
            ? "Escaneie o QR Code ou copie o codigo Pix para pagar."
            : data.paymentBrick
                ? "Finalize o pagamento abaixo, dentro do DocSpace."
                : data.checkoutUrl
                    ? "Use o link externo somente se o pagamento interno não carregar."
                    : data.message || "Quando o webhook confirmar o pagamento, o plano será renovado.";

    paymentQrPlaceholder.innerHTML = `
        <i data-lucide="${status === "approved" ? "check-circle-2" : status === "error" ? "alert-triangle" : "credit-card"}" aria-hidden="true"></i>
        <strong>${escaparHtmlSeguro(statusText)}</strong>
        <span>${escaparHtmlSeguro(description)}</span>
    `;
    inicializarIcones();
}

async function verificarPagamentoAtual() {
    if (!pagamentoAtualId) {
        paymentProofMessage.textContent = "Crie o pagamento primeiro para consultar a confirmação.";
        paymentProofMessage.className = "message error";
        return;
    }

    try {
        const verifyButton = paymentVerifyButton || paymentCopyPixButton;
        verifyButton.disabled = true;
        verifyButton.textContent = "Verificando...";
        const data = await apiRequest(`/api/billing/payments/${encodeURIComponent(pagamentoAtualId)}`);
        renderizarStatusPagamento(data);
        paymentProofMessage.textContent = data.message || "Status consultado.";
        paymentProofMessage.className = data.payment?.status === "approved" ? "message success" : "message";

        aplicarResultadoPagamentoAprovado(data);
    } catch (error) {
        paymentProofMessage.textContent = traduzirErroApi(error);
        paymentProofMessage.className = "message error";
    } finally {
        const verifyButton = paymentVerifyButton || paymentCopyPixButton;
        verifyButton.disabled = false;
        verifyButton.textContent = "Verificar pagamento";
    }
}

async function copiarCodigoPixPagamento() {
    return verificarPagamentoAtual();
}

function abrirModalPagamento() {
    paymentModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    paymentCloseButton.focus();
}

async function fecharPagamentoPlano() {
    paymentModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
    pagamentoPlanoSelecionado = "";
    pagamentoModoAtual = "";
    pagamentoAtualId = "";
    await desmontarMercadoPagoBrick();
    paymentMercadoPagoLink?.classList.add("is-hidden");
    paymentMercadoPagoLink?.removeAttribute("href");
    paymentPixCodeField?.classList.add("is-hidden");
    paymentPixCodeField?.setAttribute("aria-hidden", "true");
    if (paymentPixCode) paymentPixCode.value = "";
    paymentProofForm.reset();
    paymentProofMessage.textContent = "";
    paymentProofMessage.className = "message";
}


function obterNomePlanoPorId(planId) {
    return getPlan(planId)?.label || "Plano";
}

function obterPrecoPlano(planId) {
    return PAYMENT_PLANS[normalizePlanId(planId)]?.price || "valor a definir";
}

function normalizePlanId(planId) {
    const raw = String(planId || "").trim();

    if (!raw) {
        return "";
    }

    const lower = raw.toLowerCase();
    const compact = lower
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

    const aliasesNormalizados = {
        test3min: "test3min",
        teste3min: "test3min",
        "3minutosparateste": "test3min",
        test10c: "test10c",
        teste10c: "test10c",
        teste10centavos: "test10c",
        teste10centavo: "test10c",
        teste10cent: "test10c",
        teste10: "test10c",
        "testemercadopago": "test10c",
        "testemercadopago10centavos": "test10c",
        test15min: "basic30",
        teste5min: "basic30",
        "5minutosdeteste": "basic30",
        trial15: "basic30",
        trial7: "basic30",
        teste7: "basic30",
        teste7dias: "basic30",
        "7diastestegratis": "basic30",
        monthly30: "basic30",
        annual365: "proMax365",
        basico30: "basic30",
        basic: "basic30",
        basic30: "basic30",
        "30diasplanobasico": "basic30",
        "30diasplanopro": "basic30",
        plus: "basic30",
        plus90: "basic30",
        "90diasplanoplus": "basic30",
        pro: "basic30",
        pro180: "basic30",
        "180diasplanopro": "basic30",
        promax: "proMax365",
        promax365: "proMax365",
        promaximo365: "proMax365",
        "365diasplanopromax": "proMax365",
    };

    const alias = PLAN_ALIASES[raw] || PLAN_ALIASES[lower] || aliasesNormalizados[compact];

    if (alias) {
        return alias;
    }

    const match = Object.keys(ACCESS_PLANS).find((id) => id.toLowerCase() === lower);
    return match || raw;
}

function getPlan(planId) {
    return ACCESS_PLANS[normalizePlanId(planId)];
}

function obterClassePlano(planId) {
    return `plan-theme-${normalizePlanId(planId)}`;
}

function formatarData(valor) {
    if (!valor) {
        return "sem data";
    }

    return new Intl.DateTimeFormat("pt-BR").format(new Date(valor));
}

function formatarDataHora(valor) {
    if (!valor) {
        return "sem data";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(valor));
}

function formatarVencimento(usuario) {
    const plano = getPlan(usuario?.plan);
    return plano?.minutes ? formatarDataHora(usuario.expiresAt) : formatarData(usuario?.expiresAt);
}

function validarLogin() {
    const emailVazio = loginEmail.value.trim() === "" || !loginEmail.validity.valid;
    const senhaVazia = loginPassword.value.trim() === "";

    loginEmail.classList.toggle("is-invalid", emailVazio);
    loginPassword.classList.toggle("is-invalid", senhaVazia);
    loginEmail.setAttribute("aria-invalid", String(emailVazio));
    loginPassword.setAttribute("aria-invalid", String(senhaVazia));

    if (emailVazio || senhaVazia) {
        mostrarLoginMensagem("Informe um e-mail válido e a senha.", "error");
        (emailVazio ? loginEmail : loginPassword).focus();
        return false;
    }

    loginEmail.removeAttribute("aria-invalid");
    loginPassword.removeAttribute("aria-invalid");
    return true;
}

function mostrarTela(tela) {
    authView.classList.toggle("is-hidden", tela !== "auth");
    documentView.classList.toggle("is-hidden", tela !== "documents");
    adminView.classList.toggle("is-hidden", tela !== "admin");
    generatorView.classList.toggle("is-hidden", tela !== "generator");
    simpleDocumentView.classList.toggle("is-hidden", tela !== "simpleDocument");
    pdfLocalView.classList.toggle("is-hidden", tela !== "pdfLocal");

    document.body.classList.toggle("modal-open", false);
    document.body.classList.toggle("auth-open", tela === "auth");
    document.body.classList.toggle("document-home-open", tela === "documents");
    document.body.classList.toggle("document-generator-open", tela === "generator" || tela === "simpleDocument");
    document.body.classList.toggle("pdf-tools-open", tela === "pdfLocal");
    document.body.classList.toggle("admin-access-open", tela === "admin");

    if (tela === "documents") {
        filtrarDocumentos();
        navegarTelaInicialDocumentos("home", { focusSearch: false });
    }
}

function atualizarUsuario(user) {
    const email = user?.email || "";

    userEmailLabels.forEach((label) => {
        label.textContent = email;
    });

    atualizarResumoPlano(user);
    atualizarDashboardProduto();
}

function atualizarVisibilidadeAdmin() {
    adminAccessCard.classList.toggle("is-hidden", !usuarioAtualEhAdmin);
    filtrarDocumentos();
}

function atualizarResumoPlano(user) {
    const nome = String(user?.name || "usuário").trim().split(/\s+/)[0];
    documentUserName.textContent = nome || "usuário";
    atualizarSeloAoLadoDoNome(documentUserName, user);

    if (!user?.plan) {
        documentPlanName.textContent = "Plano indisponível";
        documentPlanRemaining.textContent = "Entre para consultar sua assinatura";
        documentPlanPercent.textContent = "0%";
        documentPlanProgress.style.width = "0%";
        documentPlanExpiration.textContent = "Vencimento não informado";
        return;
    }

    const planId = normalizePlanId(user.plan);
    const plano = getPlan(planId) || {};

    if (user.isAdmin) {
        documentPlanName.textContent = "Acesso administrativo";
        documentPlanRemaining.textContent = "Gerenciamento liberado";
        documentPlanPercent.textContent = "100%";
        documentPlanProgress.style.width = "100%";
        documentPlanExpiration.textContent = "Acesso contínuo para administração";
        return;
    }

    const vencimento = new Date(user.expiresAt).getTime();
    const restante = Math.max(0, vencimento - Date.now());
    const duracaoPlano = plano.minutes
        ? plano.minutes * 60 * 1000
        : Number(plano.days || 0) * 24 * 60 * 60 * 1000;
    const percentual = duracaoPlano > 0
        ? Math.min(100, Math.max(0, Math.round((restante / duracaoPlano) * 100)))
        : 0;

    documentPlanName.textContent = planId === "proMax365"
        ? "Plano Pro Max"
        : planId === "test10c"
            ? "Teste Mercado Pago"
            : planId === "test3min" ? "Teste de 3 minutos" : "Plano Básico";
    documentPlanRemaining.textContent = plano.minutes
        ? formatarQuantidadeRestante(restante, "minutes")
        : formatarQuantidadeRestante(restante, "days");
    documentPlanPercent.textContent = `${percentual}%`;
    documentPlanProgress.style.width = `${percentual}%`;
    documentPlanExpiration.textContent = `Válido até ${formatarVencimento(user)}`;
}

function formatarQuantidadeRestante(milissegundos, unidade) {
    const divisor = unidade === "minutes" ? 60 * 1000 : 24 * 60 * 60 * 1000;
    const quantidade = Math.max(0, Math.ceil(milissegundos / divisor));

    if (unidade === "minutes") {
        return quantidade === 1 ? "1 minuto restante" : `${quantidade} minutos restantes`;
    }

    return quantidade === 1 ? "1 dia restante" : `${quantidade} dias restantes`;
}

function mostrarMensagemAcesso(texto, tipo) {
    accessStatusMessage.textContent = texto;
    accessStatusMessage.className = `access-status ${tipo || ""}`.trim();
}

function limparMensagemAcesso() {
    mostrarMensagemAcesso("", "");
}

function mostrarLoginMensagem(texto, tipo) {
    loginMessage.textContent = texto;
    loginMessage.className = `message ${tipo || ""}`.trim();
}

function limparMensagemLogin() {
    mostrarLoginMensagem("", "");
    loginEmail.classList.remove("is-invalid");
    loginPassword.classList.remove("is-invalid");
    loginEmail.removeAttribute("aria-invalid");
    loginPassword.removeAttribute("aria-invalid");
}

function alternarLoginCarregamento(carregando, texto = "Entrar") {
    loginButton.disabled = carregando;
    loginButton.textContent = carregando ? texto : "Entrar";
}

function validarDocumentoSimples() {
    const campos = Array.from(simpleDocumentForm.querySelectorAll("[required]")).filter((campo) => !campo.disabled);
    const camposVazios = [];

    campos.forEach((campo) => {
        const vazio = campo.value.trim() === "";
        campo.classList.toggle("is-invalid", vazio);
        campo.setAttribute("aria-invalid", String(vazio));

        if (vazio) {
            camposVazios.push(obterRotuloCampoSimples(campo));
        }
    });

    if (camposVazios.length > 0) {
        mostrarMensagemDocumentoSimples(
            `Preencha os campos obrigatórios: ${camposVazios.join(", ")}.`,
            "error"
        );
        simpleDocumentForm.querySelector(".is-invalid")?.focus();
        return false;
    }

    return true;
}

function obterRotuloCampoSimples(campo) {
    return campo.closest(".field")?.querySelector("span")?.textContent || campo.name;
}

function coletarDadosDocumentoSimples() {
    const formData = new FormData(simpleDocumentForm);
    const dados = {};

    if (documentoSimplesAtual.modelChoice) {
        const choiceName = documentoSimplesAtual.modelChoice.name;
        dados[choiceName] = String(formData.get(choiceName) || "").trim();
    }

    documentoSimplesAtual.sections.forEach((section) => {
        (section.fields || []).forEach((field) => {
            dados[field.name] = String(formData.get(field.name) || "").trim();
        });

        (section.repeatableGroup?.groups || []).forEach((group) => {
            group.fields.forEach((field) => {
                dados[field.name] = String(formData.get(field.name) || "").trim();
            });
        });

        const choice = section.conditionalChoice;

        if (choice) {
            const choiceValue = String(formData.get(choice.name) || "nao").trim();
            dados[choice.name] = choiceValue;
            dados[choice.markers.sim] = choiceValue === "sim" ? "X" : "";
            dados[choice.markers.nao] = choiceValue === "nao" ? "X" : "";

            (choice.fieldsWhenYes || []).forEach((field) => {
                dados[field.name] = choiceValue === "sim"
                    ? String(formData.get(field.name) || "").trim()
                    : "";
            });
        }
    });

    return typeof documentoSimplesAtual.prepareData === "function"
        ? documentoSimplesAtual.prepareData(dados)
        : dados;
}

function obterCaminhoModeloDocumentoSimples(dados) {
    const choiceName = documentoSimplesAtual.modelChoice?.name;
    const choiceValue = choiceName ? dados[choiceName] : "";
    return documentoSimplesAtual.modelPaths?.[choiceValue] || documentoSimplesAtual.modelPath;
}

function obterNomeArquivoDocumentoSimples(dados) {
    const choiceName = documentoSimplesAtual.modelChoice?.name;
    const choiceValue = choiceName ? dados[choiceName] : "";
    return documentoSimplesAtual.fileNames?.[choiceValue] || documentoSimplesAtual.fileName;
}

function prepararDadosAutodeclaracao(dados) {
    const dataCompleta = dados.data || `${dados.dia || ""} de ${dados.mes || ""} de ${dados.ano || ""}`.trim();

    const aliases = {
        cpf_segurado: dados.cpf,
        endereco: dados.endereco_segurado,
        nome_beneficio: dados.beneficio,
        data: dataCompleta,
    };

    return { ...dados, ...aliases };
}

function mostrarMensagemDocumentoSimples(texto, tipo) {
    simpleDocumentMessage.textContent = texto;
    simpleDocumentMessage.className = `message ${tipo || ""}`.trim();
}

function limparMensagemDocumentoSimples() {
    mostrarMensagemDocumentoSimples("", "");
    simpleDocumentForm.querySelectorAll(".is-invalid").forEach((campo) => {
        campo.classList.remove("is-invalid");
        campo.removeAttribute("aria-invalid");
    });
}

function limparFormularioDocumentoSimplesAtual() {
    if (!documentoSimplesTipoAtual) {
        simpleDocumentForm.reset();
        limparMensagemDocumentoSimples();
        atualizarWizardFormulario(simpleDocumentForm);
        return;
    }

    abrirDocumentoSimples(documentoSimplesTipoAtual);
    mostrarMensagemDocumentoSimples("Campos limpos. Preencha novamente quando quiser gerar.", "");
}

function alternarCarregamentoDocumentoSimples(carregando) {
    simpleDocumentButton.disabled = carregando;
    if (simpleDocumentClearButton) {
        simpleDocumentClearButton.disabled = carregando;
    }
    simpleDocumentButton.textContent = carregando
        ? "Gerando documento..."
        : "Gerar documento";
}

function validarCamposObrigatorios() {
    const campos = Array.from(form.querySelectorAll("[required]"));
    const camposVazios = [];

    campos.forEach((campo) => {
        const vazio = campo.value.trim() === "";
        campo.classList.toggle("is-invalid", vazio);
        campo.setAttribute("aria-invalid", String(vazio));

        if (vazio) {
            camposVazios.push(FIELD_LABELS[campo.name] || campo.name);
        }
    });

    if (camposVazios.length > 0) {
        mostrarMensagem(
            `Preencha os campos obrigatórios: ${camposVazios.join(", ")}.`,
            "error"
        );
        form.querySelector(".is-invalid")?.focus();
        return false;
    }

    return validarAreaUtilizada();
}

function validarAreaUtilizada() {
    const areaImovel = form.elements.tamanho_trerra_numeros;
    const areaUtilizada = form.elements.tamanho_utilizado_numeros;
    const valorAreaImovel = converterNumeroBrasileiro(areaImovel.value);
    const valorAreaUtilizada = converterNumeroBrasileiro(areaUtilizada.value);

    if (valorAreaImovel === null || valorAreaUtilizada === null) {
        areaImovel.classList.toggle("is-invalid", valorAreaImovel === null);
        areaUtilizada.classList.toggle("is-invalid", valorAreaUtilizada === null);
        mostrarMensagem("Informe valores numéricos válidos para as áreas. Exemplo: 4 ou 3,5.", "error");
        (valorAreaImovel === null ? areaImovel : areaUtilizada).focus();
        return false;
    }

    if (valorAreaUtilizada >= valorAreaImovel) {
        areaUtilizada.classList.add("is-invalid");
        areaUtilizada.setAttribute("aria-invalid", "true");
        mostrarMensagem(
            "A área utilizada deve ser menor que a área total do imóvel. Exemplo: imóvel 4 ha e área utilizada 3,5 ha.",
            "error"
        );
        areaUtilizada.focus();
        return false;
    }

    areaImovel.classList.remove("is-invalid");
    areaUtilizada.classList.remove("is-invalid");
    areaImovel.removeAttribute("aria-invalid");
    areaUtilizada.removeAttribute("aria-invalid");
    return true;
}

function converterNumeroBrasileiro(valor) {
    const numeroLimpo = valor.trim().replace(/\s/g, "");

    if (!numeroLimpo) {
        return null;
    }

    const normalizado = numeroLimpo.includes(",")
        ? numeroLimpo.replace(/\./g, "").replace(",", ".")
        : numeroLimpo;
    const numero = Number(normalizado);

    return Number.isFinite(numero) ? numero : null;
}

function coletarDadosDoFormulario() {
    const formData = new FormData(form);
    const dados = {};

    Object.keys(FIELD_LABELS).forEach((campo) => {
        dados[campo] = String(formData.get(campo) || "").trim();
    });

    dados.municipio_comandatario = dados["município_comandatrio"];
    dados.nome_comodatario = dados.nome_comandatario;
    dados.nacionalidade_comandatario = "brasileiro";
    dados.nacionalidade_comodatario = "brasileiro";
    dados.estado_civil_comodatario = dados.estado_civil_comandatario;
    dados.profissao_comodatario = dados.profissao_comandatario;
    dados["profissão_comandatario"] = dados.profissao_comandatario;
    dados["profissão_comodatario"] = dados.profissao_comandatario;
    dados.rg_comodatario = dados.rg_comandatario;
    dados.cpf_comodatario = dados.cpf_comandatario;
    dados.localidade_comodatario = dados.localidade_comandatario;
    dados.localidade_proxima_comodatario = dados.localidade_proxima_comandatario;
    dados.municipio_comodatario = dados["município_comandatrio"];
    dados["profissão_comandante"] = dados.profissao_comandante;
    dados.duracao_contrato = dados["duração_contrato"];
    dados.nome_comandante_falecido = dados.nome_comandante;
    dados.estado_civil_comandante_falecido = dados.estado_civil_comandante;
    dados.profissao_comandante_falecido = dados.profissao_comandante;
    dados.rg_comandante_falecido = dados.rg_comandante;
    dados.cpf_comandante_falecido = dados.cpf_comandante;
    dados.localidade_comandante_falecido = dados.localidade_comandante;
    dados["endereço_representante"] = dados.endereco_representante;

    return dados;
}

async function gerarArquivoDocx(dados, caminhoModelo) {
    const modelo = await carregarModeloDocx(caminhoModelo);
    const zip = new window.PizZip(modelo);
    const documento = new window.docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: {
            start: "{{",
            end: "}}",
        },
    });

    documento.render(dados);

    return documento.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        compression: "DEFLATE",
    });
}

async function carregarModeloDocx(caminhoModelo) {
    let resposta;

    try {
        resposta = await fetch(caminhoModelo);
    } catch (error) {
        throw new Error(
            `Não foi possível carregar o modelo. Abra o projeto por um servidor local e confirme o arquivo ${caminhoModelo}.`
        );
    }

    if (!resposta.ok) {
        throw new Error(
            `Modelo não encontrado. Confirme se existe o arquivo ${caminhoModelo}.`
        );
    }

    return resposta.arrayBuffer();
}

function possuiConjugeSelecionado() {
    return form.elements.possui_conjuge.value === "sim";
}

function possuiObitoSelecionado() {
    return form.elements.possui_obito.value === "sim";
}

function obterCaminhoDoModelo() {
    if (possuiObitoSelecionado()) {
        return possuiConjugeSelecionado()
            ? MODEL_PATHS.comConjugeComObito
            : MODEL_PATHS.semConjugeComObito;
    }

    return possuiConjugeSelecionado()
        ? MODEL_PATHS.comConjugeSemObito
        : MODEL_PATHS.semConjugeSemObito;
}

function atualizarSecaoConjuge() {
    const exibirConjuge = possuiConjugeSelecionado();

    conjugeSection.classList.toggle("is-hidden", !exibirConjuge);
    conjugeSection.setAttribute("aria-hidden", String(!exibirConjuge));

    conjugeFields.forEach((campo) => {
        campo.disabled = !exibirConjuge;
        campo.required = exibirConjuge;

        if (!exibirConjuge) {
            campo.classList.remove("is-invalid");
            campo.removeAttribute("aria-invalid");
        }
    });

    atualizarWizardFormulario(form);
}

function atualizarSecaoObito() {
    const exibirObito = possuiObitoSelecionado();

    obitoSection.classList.toggle("is-hidden", !exibirObito);
    obitoSection.setAttribute("aria-hidden", String(!exibirObito));

    obitoFields.forEach((campo) => {
        campo.disabled = !exibirObito;
        campo.required = exibirObito;

        if (!exibirObito) {
            campo.classList.remove("is-invalid");
            campo.removeAttribute("aria-invalid");
        }
    });

    atualizarWizardFormulario(form);
}

function mostrarMensagem(texto, tipo) {
    message.textContent = texto;
    message.className = `message ${tipo || ""}`.trim();
}

function limparMensagem() {
    mostrarMensagem("", "");
    form.querySelectorAll(".is-invalid").forEach((campo) => {
        campo.classList.remove("is-invalid");
        campo.removeAttribute("aria-invalid");
    });
}

function limparFormularioContrato() {
    form.reset();
    limparMensagem();
    atualizarSecaoConjuge();
    atualizarSecaoObito();
    atualizarWizardFormulario(form);
    form.querySelector("input, select, textarea")?.focus();
    mostrarMensagem("Campos limpos. Preencha novamente quando quiser gerar.", "");
}

function alternarCarregamento(carregando) {
    button.disabled = carregando;
    if (clearContractFormButton) {
        clearContractFormButton.disabled = carregando;
    }
    button.textContent = carregando ? "Gerando..." : "Gerar Contrato";
}

function mostrarMensagemAdmin(texto, tipo) {
    adminAccessMessage.textContent = texto;
    adminAccessMessage.className = `message ${tipo || ""}`.trim();
}

function limparMensagemAdmin() {
    mostrarMensagemAdmin("", "");
    adminAccessForm.querySelectorAll(".is-invalid").forEach((campo) => {
        campo.classList.remove("is-invalid");
        campo.removeAttribute("aria-invalid");
    });
}

function alternarAdminCarregamento(carregando, texto = "Criar login") {
    adminAccessButton.disabled = carregando;
    adminAccessButton.textContent = carregando
        ? texto
        : (adminEditingUid.value ? "Salvar alteracoes" : "Criar login");
}

async function garantirBibliotecas() {
    for (const library of LIBRARIES) {
        if (window[library.globalName]) {
            continue;
        }

        await carregarBiblioteca(library);
    }
}

async function carregarBiblioteca(library) {
    for (const url of library.urls) {
        try {
            await carregarScript(url);

            if (window[library.globalName]) {
                return;
            }
        } catch (error) {
            console.warn(`Falha ao carregar ${library.label} por ${url}`, error);
        }
    }

    throw new Error(
        `A biblioteca ${library.label} não foi carregada. Verifique sua conexão com a internet ou libere os CDNs no navegador.`
    );
}

function carregarScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = url;
        script.async = false;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Não foi possível carregar ${url}`));

        document.head.appendChild(script);
    });
}

function tratarErro(error, mostrarErro = mostrarMensagem) {
    const mensagem = error?.message || "Ocorreu um erro ao gerar o documento.";

    if (error?.status === 429 || error?.data?.code === "DAILY_DOCUMENT_LIMIT" || mensagem.includes("Limite diario")) {
        mostrarErro(traduzirErroApi(error), "error");
        return;
    }

    if (mensagem.includes("modelo") || mensagem.includes("Modelo")) {
        mostrarErro(mensagem, "error");
        return;
    }

    if (mensagem.includes("biblioteca") || mensagem.includes("CDN")) {
        mostrarErro(mensagem, "error");
        return;
    }

    mostrarErro(
        "Não foi possível gerar o documento. Verifique se os campos do Word estão corretos.",
        "error"
    );
}

function traduzirErroApi(error) {
    const message = error?.data?.message || error?.message || "Nao foi possivel concluir a acao.";

    if (/^Plano invalido\.?$/i.test(String(message).trim())) {
        return "A API do Cloudflare ainda esta com os planos antigos. Cole o worker-backend-pronto.js atualizado no Worker e clique em Deploy.";
    }

    if (/^Rota nao encontrada\.?$/i.test(String(message).trim())) {
        return "A API carregada nao encontrou esta rota. Atualize a pagina; se continuar, publique o Worker/API atualizado.";
    }

    return message;
}

async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    const billingToken = localStorage.getItem(BILLING_TOKEN_KEY);

    if (sessionToken) {
        headers.set("Authorization", `Bearer ${sessionToken}`);
    }

    if (billingToken) {
        headers.set("X-Billing-Token", billingToken);
    }

    const request = {
        method: options.method || "GET",
        credentials: "include",
        headers,
    };

    if (options.body !== undefined) {
        headers.set("Content-Type", "application/json");
        request.body = JSON.stringify(options.body);
    }

    const response = await fetch(montarUrlApi(path), request);
    const contentType = response.headers.get("Content-Type") || "";
    const data = contentType.includes("application/json") ? await response.json() : {};

    if (data.billingToken) {
        localStorage.setItem(BILLING_TOKEN_KEY, data.billingToken);
    }

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem(SESSION_TOKEN_KEY);
        }

        const error = new Error(data.message || "Erro na API.");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    if (data.sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
    }

    if (path.includes("/auth/logout")) {
        localStorage.removeItem(SESSION_TOKEN_KEY);
        localStorage.removeItem(BILLING_TOKEN_KEY);
    }

    return data;
}

function montarUrlApi(path) {
    const base = API_BASE_URL.replace(/\/$/, "");
    const caminho = path.startsWith("/") ? path : `/${path}`;
    return `${base}${caminho}`;
}

function registrarServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch((error) => {
            console.warn("Não foi possível registrar o PWA.", error);
        });
    });
}

const CACHE_NAME = "docspace-v97-pdf-layout-light-theme";

const APP_ASSETS = [
    "./",
    "./index.html",
    "./contro.html",
    "./style.css",
    "./script.js",
    "./pdf-preview.js",
    "./contro.js",
    "./manifest.webmanifest",
    "./assets/privacy-warning.png",
    "./assets/LOGO1.png",
    "./assets/LOGO2.png",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./modelos/contrato_sem_conjuge.docx",
    "./modelos/contrato_com_conjuge.docx",
    "./modelos/contrato_sem_conjuge_falecido_representante_final.docx",
    "./modelos/contrato_com_conjuge_falecido_representante_final.docx",
    "./modelos/declaracao_ufba_membros.docx",
    "./modelos/decrlaracao_renda_membros.docx",
    "./modelos/declaracao_posso.docx",
    "./modelos/AutodeclaraÃ§Ã£o - SEM REPRESENTAÃ‡ÃƒO.docx",
    "./modelos/AutodeclaraÃ§Ã£o - COM REPRESENTAÃ‡ÃƒO.docx",
    "./modelos/procuracao_consumidor.docx",
    "./modelos/procuracao_normal.docx",
    "./modelos/contrato_honorarios_50.docx",
    "./modelos/contrato_prev_40.docx",
    "./modelos/contrato_prev_30.docx",
    "./modelos/contrato_compra_venda_template_sistema_negrito.docx",
    "./modelos/contrato_compra_venda_veiculo_bem_movel_template.docx",
    "./modelos/cadastro_confrontantes_template(1).docx",
    "./modelos/controle_producao_anual_template(1).docx",
    "./modelos/controle_rebanho_template(1).docx",
    "./modelos/inventario_producao_rural_template.docx",
    "./modelos/contrato_arrendamento_rural_template.docx",
    "./modelos/contrato_comodato_equipamentos_template.docx",
    "./modelos/contrato_parceria_rural_template.docx",
    "./modelos/declaracao_posse_mansa_pacifica_template.docx",
    "./modelos/declaracao_residencia_template.docx",
    "./modelos/declaracao_nao_possuir_renda_template.docx",
    "./modelos/declaracao_exercicio_agricultura_familiar_template.docx",
    "./modelos/declaracao_dependencia_economica_template.docx",
    "./modelos/declaracao_convivencia_familiar_template.docx",
    "./modelos/declaracao_baixa_renda_template.docx",
    "./modelos/declaracao_autenticidade_documentos_template.docx",
    "./modelos/declaracao_atividade_rural_template.docx",
    "./modelos/declaracao_uniao_estavel_template.docx",
    "./modelos/declaracao_tempo_trabalho_rural_template.docx",

];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const requestUrl = new URL(request.url);

    if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
        return;
    }

    if (requestUrl.pathname.startsWith("/api/")) {
        return;
    }

    if (request.mode === "navigate") {
        const fallbackUrl = requestUrl.pathname.endsWith("/contro.html")
            ? "./contro.html"
            : "./index.html";
        event.respondWith(buscarAtualizarCache(request, fallbackUrl));
        return;
    }

    event.respondWith(buscarAtualizarCache(request));
});

async function buscarAtualizarCache(request, fallbackUrl) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        if (fallbackUrl) {
            return cache.match(fallbackUrl);
        }

        throw error;
    }
}




(() => {
    "use strict";

    const API_BASE_URL = String(window.DOCSPACE_CONFIG?.API_BASE_URL || "").trim().replace(/\/+$/, "");
    // Disponibiliza a URL da API para os módulos complementares.
    window.API_BASE_URL = API_BASE_URL;
    const SESSION_TOKEN_KEY = "documentos_rurais_session_token";
    const BILLING_TOKEN_KEY = "documentos_rurais_billing_token";
    const APP_VERSION = "DocSpace Web v1.49 — GitHub Pages + Cloudflare Worker";
    const DOCS = [
    {
        "id": "comodato",
        "title": "Contrato de comodato rural",
        "description": "Contrato com escolha automática de modelo por cônjuge e óbito.",
        "category": "contratos",
        "fileName": "contrato-comodato-preenchido.docx",
        "modelPaths": {
            "semConjugeSemObito": "modelos/contrato_sem_conjuge.docx",
            "comConjugeSemObito": "modelos/contrato_com_conjuge.docx",
            "semConjugeComObito": "modelos/contrato_sem_conjuge_falecido_representante_final.docx",
            "comConjugeComObito": "modelos/contrato_com_conjuge_falecido_representante_final.docx"
        },
        "fields": [
            {
                "name": "nome_comandante",
                "label": "Nome completo do comodante",
                "wide": false
            },
            {
                "name": "estado_civil_comandante",
                "label": "Estado civil do comodante",
                "wide": false
            },
            {
                "name": "profissao_comandante",
                "label": "Profissão do comodante",
                "wide": false
            },
            {
                "name": "rg_comandante",
                "label": "RG do comodante",
                "wide": false
            },
            {
                "name": "cpf_comandante",
                "label": "CPF/CNPJ do comodante",
                "wide": false
            },
            {
                "name": "localidade_comandante",
                "label": "Localidade do comodante",
                "wide": true
            },
            {
                "name": "nome_comandatario",
                "label": "Nome completo do comodatário",
                "wide": false
            },
            {
                "name": "estado_civil_comandatario",
                "label": "Estado civil do comodatário",
                "wide": false
            },
            {
                "name": "profissao_comandatario",
                "label": "Profissão do comodatário",
                "wide": false
            },
            {
                "name": "rg_comandatario",
                "label": "RG do comodatário",
                "wide": false
            },
            {
                "name": "cpf_comandatario",
                "label": "CPF/CNPJ do comodatário",
                "wide": false
            },
            {
                "name": "localidade_comandatario",
                "label": "Localidade do comodatário",
                "wide": true
            },
            {
                "name": "localidade_proxima_comandatario",
                "label": "Comunidade/localidade próxima",
                "wide": true
            },
            {
                "name": "municipio_comandatario",
                "label": "Município do comodatário",
                "wide": false
            },
            {
                "name": "nome_imovel",
                "label": "Nome do imóvel rural",
                "wide": false
            },
            {
                "name": "localidade_imovel_rural",
                "label": "Localidade do imóvel rural",
                "wide": true
            },
            {
                "name": "nirf_terra",
                "label": "NIRF do imóvel",
                "wide": false
            },
            {
                "name": "tamanho_trerra_numeros",
                "label": "Área do imóvel em números",
                "wide": false
            },
            {
                "name": "tamanho_terra_letras",
                "label": "Área do imóvel por extenso",
                "wide": false
            },
            {
                "name": "oque_produz",
                "label": "O que produz",
                "wide": false
            },
            {
                "name": "tamanho_utilizado_numeros",
                "label": "Área utilizada em números",
                "wide": false
            },
            {
                "name": "tamanho_utilizado_letras",
                "label": "Área utilizada por extenso",
                "wide": false
            },
            {
                "name": "duracao_contrato",
                "label": "Duração do contrato",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            },
            {
                "name": "nome_conjuge",
                "label": "Nome conjuge",
                "wide": false
            },
            {
                "name": "nacionalidade_conjuge",
                "label": "Nacionalidade conjuge",
                "wide": false
            },
            {
                "name": "estado_civil_conjuge",
                "label": "Estado civil conjuge",
                "wide": false
            },
            {
                "name": "profissao_conjuge",
                "label": "Profissao conjuge",
                "wide": false
            },
            {
                "name": "rg_conjuge",
                "label": "RG conjuge",
                "wide": false
            },
            {
                "name": "cpf_conjuge",
                "label": "CPF conjuge",
                "wide": false
            },
            {
                "name": "localidade_conjuge",
                "label": "Localidade conjuge",
                "wide": true
            },
            {
                "name": "localidade_proxima_conjuge",
                "label": "Localidade proxima conjuge",
                "wide": true
            },
            {
                "name": "municipio_conjuge",
                "label": "Municipio conjuge",
                "wide": false
            },
            {
                "name": "nome_comandante_falecido",
                "label": "Nome comandante falecido",
                "wide": false
            },
            {
                "name": "estado_civil_comandante_falecido",
                "label": "Estado civil comandante falecido",
                "wide": false
            },
            {
                "name": "profissao_comandante_falecido",
                "label": "Profissao comandante falecido",
                "wide": false
            },
            {
                "name": "rg_comandante_falecido",
                "label": "RG comandante falecido",
                "wide": false
            },
            {
                "name": "cpf_comandante_falecido",
                "label": "CPF comandante falecido",
                "wide": false
            },
            {
                "name": "localidade_comandante_falecido",
                "label": "Localidade comandante falecido",
                "wide": true
            },
            {
                "name": "numero_obito",
                "label": "Numero obito",
                "wide": false
            },
            {
                "name": "data_falecimento",
                "label": "Data falecimento",
                "wide": false
            },
            {
                "name": "representante_do_falecido",
                "label": "Representante do falecido",
                "wide": false
            },
            {
                "name": "parentesco_representante",
                "label": "Parentesco representante",
                "wide": false
            },
            {
                "name": "rg_representante",
                "label": "RG representante",
                "wide": false
            },
            {
                "name": "cpf_representante",
                "label": "CPF representante",
                "wide": false
            },
            {
                "name": "endereco_representante",
                "label": "Endereço representante",
                "wide": true
            }
        ],
        "choices": [
            {
                "name": "possui_conjuge",
                "label": "O comodante possui cônjuge ou companheiro(a)?",
                "options": [
                    {
                        "value": "nao",
                        "label": "Não"
                    },
                    {
                        "value": "sim",
                        "label": "Sim"
                    }
                ]
            },
            {
                "name": "possui_obito",
                "label": "O comodante é falecido?",
                "options": [
                    {
                        "value": "nao",
                        "label": "Não"
                    },
                    {
                        "value": "sim",
                        "label": "Sim"
                    }
                ]
            }
        ]
    },
    {
        "id": "ufba-membros",
        "title": "Declaração UFBA de membros",
        "description": "Preencha os dados do representante, produtos, valores e data da declaração.",
        "category": "rural",
        "fileName": "declaracao-ufba-membros.docx",
        "fields": [
            {
                "name": "nome_representante",
                "label": "Nome representante",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "localidade",
                "label": "Localidade",
                "wide": true
            },
            {
                "name": "produto1",
                "label": "Produto1",
                "wide": true
            },
            {
                "name": "valor1",
                "label": "Valor1",
                "wide": false
            },
            {
                "name": "produto2",
                "label": "Produto2",
                "wide": true
            },
            {
                "name": "valor2",
                "label": "Valor2",
                "wide": false
            },
            {
                "name": "produto3",
                "label": "Produto3",
                "wide": true
            },
            {
                "name": "valor3",
                "label": "Valor3",
                "wide": false
            },
            {
                "name": "valor_total_numeros",
                "label": "Valor total numeros",
                "wide": false
            },
            {
                "name": "valor_total_escrito",
                "label": "Valor total escrito",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/declaracao_ufba_membros.docx"
    },
    {
        "id": "renda-membros",
        "title": "Declaração de renda de membros",
        "description": "Preencha os dados do representante, membro, tipo de renda, valor anual e data.",
        "category": "rural",
        "fileName": "declaracao-renda-membros.docx",
        "fields": [
            {
                "name": "nome_representante",
                "label": "Nome representante",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "localidade",
                "label": "Localidade",
                "wide": true
            },
            {
                "name": "tipo_renda",
                "label": "Tipo renda",
                "wide": false
            },
            {
                "name": "nome_mebro",
                "label": "Nome mebro",
                "wide": false
            },
            {
                "name": "valor_anual",
                "label": "Valor anual",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/declaracao_renda_membros.docx"
    },
    {
        "id": "posse",
        "title": "Declaração de posse",
        "description": "Preencha os dados do posseiro, do imóvel, do período de posse e dos confrontantes.",
        "category": "rural",
        "fileName": "declaracao-posse.docx",
        "fields": [
            {
                "name": "nome_posseiro",
                "label": "Nome posseiro",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado civil",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "periodo_numero",
                "label": "Período numero",
                "wide": false
            },
            {
                "name": "periodo_extenso",
                "label": "Período extenso",
                "wide": false
            },
            {
                "name": "nome_imovel",
                "label": "Nome do imóvel rural",
                "wide": false
            },
            {
                "name": "area_total_imovel",
                "label": "Área total imovel",
                "wide": false
            },
            {
                "name": "ao_norte",
                "label": "Ao norte",
                "wide": false
            },
            {
                "name": "cpf_norte",
                "label": "CPF norte",
                "wide": false
            },
            {
                "name": "ao_leste",
                "label": "Ao leste",
                "wide": false
            },
            {
                "name": "cpf_leste",
                "label": "CPF leste",
                "wide": false
            },
            {
                "name": "ao_oeste",
                "label": "Ao oeste",
                "wide": false
            },
            {
                "name": "cpf_oeste",
                "label": "CPF oeste",
                "wide": false
            },
            {
                "name": "ao_sul",
                "label": "Ao sul",
                "wide": false
            },
            {
                "name": "cpf_sul",
                "label": "CPF sul",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/declaracao_posso.docx"
    },
    {
        "id": "autodeclaracao-rural",
        "title": "Autodeclaração rural",
        "description": "Preencha os dados do segurado especial rural e escolha se o documento terá representação.",
        "category": "rural",
        "fileName": "autodeclaracao-rural.docx",
        "fields": [
            {
                "name": "nome_segurado",
                "label": "Nome segurado",
                "wide": false
            },
            {
                "name": "escolaridade_segurado",
                "label": "Escolaridade segurado",
                "wide": false
            },
            {
                "name": "telefone1_segurado",
                "label": "Telefone1 segurado",
                "wide": false
            },
            {
                "name": "cor_raca_segurado",
                "label": "Cor raca segurado",
                "wide": false
            },
            {
                "name": "telefone2_segurado",
                "label": "Telefone2 segurado",
                "wide": false
            },
            {
                "name": "estado_civil_segurado",
                "label": "Estado civil segurado",
                "wide": false
            },
            {
                "name": "endereco_segurado",
                "label": "Endereco segurado",
                "wide": true
            },
            {
                "name": "cpf_segurado",
                "label": "CPF segurado",
                "wide": false
            },
            {
                "name": "beneficio",
                "label": "Beneficio",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            },
            {
                "name": "apelido_segurado",
                "label": "Apelido segurado",
                "wide": false
            },
            {
                "name": "data_nascimento",
                "label": "Data nascimento",
                "wide": false
            },
            {
                "name": "local_nascimento",
                "label": "Local nascimento",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "uf",
                "label": "UF",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "local_expedicao",
                "label": "Local expedicao",
                "wide": false
            },
            {
                "name": "data_emissao",
                "label": "Data emissao",
                "wide": false
            },
            {
                "name": "periodo_inicial_1",
                "label": "Periodo inicial 1",
                "wide": false
            },
            {
                "name": "periodo_final_1",
                "label": "Periodo final 1",
                "wide": false
            },
            {
                "name": "condicao_1",
                "label": "Condicao 1",
                "wide": false
            },
            {
                "name": "situacao_individual_1",
                "label": "Situacao individual 1",
                "wide": false
            },
            {
                "name": "situacao_regime_1",
                "label": "Situacao regime 1",
                "wide": false
            },
            {
                "name": "periodo_inicial_2",
                "label": "Periodo inicial 2",
                "wide": false
            },
            {
                "name": "periodo_final_2",
                "label": "Periodo final 2",
                "wide": false
            },
            {
                "name": "condicao_2",
                "label": "Condicao 2",
                "wide": false
            },
            {
                "name": "situacao_individual_2",
                "label": "Situacao individual 2",
                "wide": false
            },
            {
                "name": "situacao_regime_2",
                "label": "Situacao regime 2",
                "wide": false
            },
            {
                "name": "periodo_inicial_3",
                "label": "Periodo inicial 3",
                "wide": false
            },
            {
                "name": "periodo_final_3",
                "label": "Periodo final 3",
                "wide": false
            },
            {
                "name": "condicao_3",
                "label": "Condicao 3",
                "wide": false
            },
            {
                "name": "situacao_individual_3",
                "label": "Situacao individual 3",
                "wide": false
            },
            {
                "name": "situacao_regime_3",
                "label": "Situacao regime 3",
                "wide": false
            },
            {
                "name": "titular",
                "label": "Titular",
                "wide": false
            },
            {
                "name": "componente",
                "label": "Componente",
                "wide": false
            },
            {
                "name": "nome_familiar_1",
                "label": "Nome familiar 1",
                "wide": false
            },
            {
                "name": "dn_familiar_1",
                "label": "Dn familiar 1",
                "wide": false
            },
            {
                "name": "cpf_familiar_1",
                "label": "CPF familiar 1",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_1",
                "label": "Estado civil familiar 1",
                "wide": false
            },
            {
                "name": "parentesco_familiar_1",
                "label": "Parentesco familiar 1",
                "wide": false
            },
            {
                "name": "nome_familiar_2",
                "label": "Nome familiar 2",
                "wide": false
            },
            {
                "name": "dn_familiar_2",
                "label": "Dn familiar 2",
                "wide": false
            },
            {
                "name": "cpf_familiar_2",
                "label": "CPF familiar 2",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_2",
                "label": "Estado civil familiar 2",
                "wide": false
            },
            {
                "name": "parentesco_familiar_2",
                "label": "Parentesco familiar 2",
                "wide": false
            },
            {
                "name": "nome_familiar_3",
                "label": "Nome familiar 3",
                "wide": false
            },
            {
                "name": "dn_familiar_3",
                "label": "Dn familiar 3",
                "wide": false
            },
            {
                "name": "cpf_familiar_3",
                "label": "CPF familiar 3",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_3",
                "label": "Estado civil familiar 3",
                "wide": false
            },
            {
                "name": "parentesco_familiar_3",
                "label": "Parentesco familiar 3",
                "wide": false
            },
            {
                "name": "nome_familiar_4",
                "label": "Nome familiar 4",
                "wide": false
            },
            {
                "name": "dn_familiar_4",
                "label": "Dn familiar 4",
                "wide": false
            },
            {
                "name": "cpf_familiar_4",
                "label": "CPF familiar 4",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_4",
                "label": "Estado civil familiar 4",
                "wide": false
            },
            {
                "name": "parentesco_familiar_4",
                "label": "Parentesco familiar 4",
                "wide": false
            },
            {
                "name": "itr_terra_1",
                "label": "Itr terra 1",
                "wide": false
            },
            {
                "name": "nome_propiedade_1",
                "label": "Nome propiedade 1",
                "wide": false
            },
            {
                "name": "municipio_uf_1",
                "label": "Municipio UF 1",
                "wide": false
            },
            {
                "name": "area_total_1",
                "label": "Area total 1",
                "wide": false
            },
            {
                "name": "area_explorada_1",
                "label": "Area explorada 1",
                "wide": false
            },
            {
                "name": "nome_proprietario_1",
                "label": "Nome proprietario 1",
                "wide": false
            },
            {
                "name": "cpf_proprietario_1",
                "label": "CPF proprietario 1",
                "wide": false
            },
            {
                "name": "itr_terra_2",
                "label": "Itr terra 2",
                "wide": false
            },
            {
                "name": "nome_propiedade_2",
                "label": "Nome propiedade 2",
                "wide": false
            },
            {
                "name": "municipio_uf_2",
                "label": "Municipio UF 2",
                "wide": false
            },
            {
                "name": "area_total_2",
                "label": "Area total 2",
                "wide": false
            },
            {
                "name": "area_explorada_2",
                "label": "Area explorada 2",
                "wide": false
            },
            {
                "name": "nome_proprietario_2",
                "label": "Nome proprietario 2",
                "wide": false
            },
            {
                "name": "cpf_proprietario_2",
                "label": "CPF proprietario 2",
                "wide": false
            },
            {
                "name": "itr_terra_3",
                "label": "Itr terra 3",
                "wide": false
            },
            {
                "name": "nome_propiedade_3",
                "label": "Nome propiedade 3",
                "wide": false
            },
            {
                "name": "municipio_uf_3",
                "label": "Municipio UF 3",
                "wide": false
            },
            {
                "name": "area_total_3",
                "label": "Area total 3",
                "wide": false
            },
            {
                "name": "area_explorada_3",
                "label": "Area explorada 3",
                "wide": false
            },
            {
                "name": "nome_proprietario_3",
                "label": "Nome proprietario 3",
                "wide": false
            },
            {
                "name": "cpf_proprietario_3",
                "label": "CPF proprietario 3",
                "wide": false
            },
            {
                "name": "itr_terra_4",
                "label": "Itr terra 4",
                "wide": false
            },
            {
                "name": "nome_propiedade_4",
                "label": "Nome propiedade 4",
                "wide": false
            },
            {
                "name": "municipio_uf_4",
                "label": "Municipio UF 4",
                "wide": false
            },
            {
                "name": "area_total_4",
                "label": "Area total 4",
                "wide": false
            },
            {
                "name": "area_explorada_4",
                "label": "Area explorada 4",
                "wide": false
            },
            {
                "name": "nome_proprietario_4",
                "label": "Nome proprietario 4",
                "wide": false
            },
            {
                "name": "cpf_proprietario_4",
                "label": "CPF proprietario 4",
                "wide": false
            },
            {
                "name": "atividade_rural_1",
                "label": "Atividade rural 1",
                "wide": true
            },
            {
                "name": "subsistencia_venda_1",
                "label": "Subsistencia venda 1",
                "wide": false
            },
            {
                "name": "atividade_rural_2",
                "label": "Atividade rural 2",
                "wide": true
            },
            {
                "name": "subsistencia_venda_2",
                "label": "Subsistencia venda 2",
                "wide": false
            },
            {
                "name": "atividade_rural_3",
                "label": "Atividade rural 3",
                "wide": true
            },
            {
                "name": "subsistencia_venda_3",
                "label": "Subsistencia venda 3",
                "wide": false
            },
            {
                "name": "sim_ipi",
                "label": "Sim ipi",
                "wide": false
            },
            {
                "name": "nao_ipi",
                "label": "Nao ipi",
                "wide": false
            },
            {
                "name": "ipi_periodo_1",
                "label": "Ipi periodo 1",
                "wide": false
            },
            {
                "name": "ipi_periodo_2",
                "label": "Ipi periodo 2",
                "wide": false
            },
            {
                "name": "sim_empregados",
                "label": "Sim empregados",
                "wide": false
            },
            {
                "name": "nao_empregados",
                "label": "Nao empregados",
                "wide": false
            },
            {
                "name": "empregado_nome_1",
                "label": "Empregado nome 1",
                "wide": false
            },
            {
                "name": "empregado_cpf_1",
                "label": "Empregado CPF 1",
                "wide": false
            },
            {
                "name": "empregado_periodo_1",
                "label": "Empregado periodo 1",
                "wide": false
            },
            {
                "name": "empregado_nome_2",
                "label": "Empregado nome 2",
                "wide": false
            },
            {
                "name": "empregado_cpf_2",
                "label": "Empregado CPF 2",
                "wide": false
            },
            {
                "name": "empregado_periodo_2",
                "label": "Empregado periodo 2",
                "wide": false
            },
            {
                "name": "empregado_nome_3",
                "label": "Empregado nome 3",
                "wide": false
            },
            {
                "name": "empregado_cpf_3",
                "label": "Empregado CPF 3",
                "wide": false
            },
            {
                "name": "empregado_periodo_3",
                "label": "Empregado periodo 3",
                "wide": false
            },
            {
                "name": "sim_outra_atividade",
                "label": "Sim outra atividade",
                "wide": true
            },
            {
                "name": "nao_outra_atividade",
                "label": "Nao outra atividade",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_1",
                "label": "Outra atividade renda 1",
                "wide": true
            },
            {
                "name": "outra_atividade_local_1",
                "label": "Outra atividade local 1",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_1",
                "label": "Outra atividade periodo 1",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_2",
                "label": "Outra atividade renda 2",
                "wide": true
            },
            {
                "name": "outra_atividade_local_2",
                "label": "Outra atividade local 2",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_2",
                "label": "Outra atividade periodo 2",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_3",
                "label": "Outra atividade renda 3",
                "wide": true
            },
            {
                "name": "outra_atividade_local_3",
                "label": "Outra atividade local 3",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_3",
                "label": "Outra atividade periodo 3",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_4",
                "label": "Outra atividade renda 4",
                "wide": true
            },
            {
                "name": "outra_atividade_local_4",
                "label": "Outra atividade local 4",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_4",
                "label": "Outra atividade periodo 4",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_5",
                "label": "Outra atividade renda 5",
                "wide": true
            },
            {
                "name": "outra_atividade_local_5",
                "label": "Outra atividade local 5",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_5",
                "label": "Outra atividade periodo 5",
                "wide": true
            },
            {
                "name": "sim_outra_renda",
                "label": "Sim outra renda",
                "wide": false
            },
            {
                "name": "nao_outra_renda",
                "label": "Nao outra renda",
                "wide": false
            },
            {
                "name": "outra_renda_atividade_1",
                "label": "Outra renda atividade 1",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_1",
                "label": "Outra renda periodo 1",
                "wide": false
            },
            {
                "name": "outra_renda_valor_1",
                "label": "Outra renda valor 1",
                "wide": false
            },
            {
                "name": "outra_renda_informacoes_1",
                "label": "Outra renda informacoes 1",
                "wide": false
            },
            {
                "name": "outra_renda_atividade_2",
                "label": "Outra renda atividade 2",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_2",
                "label": "Outra renda periodo 2",
                "wide": false
            },
            {
                "name": "outra_renda_valor_2",
                "label": "Outra renda valor 2",
                "wide": false
            },
            {
                "name": "outra_renda_informacoes_2",
                "label": "Outra renda informacoes 2",
                "wide": false
            },
            {
                "name": "outra_renda_atividade_3",
                "label": "Outra renda atividade 3",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_3",
                "label": "Outra renda periodo 3",
                "wide": false
            },
            {
                "name": "outra_renda_valor_3",
                "label": "Outra renda valor 3",
                "wide": false
            },
            {
                "name": "outra_renda_informacoes_3",
                "label": "Outra renda informacoes 3",
                "wide": false
            },
            {
                "name": "outra_renda_atividade_4",
                "label": "Outra renda atividade 4",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_4",
                "label": "Outra renda periodo 4",
                "wide": false
            },
            {
                "name": "outra_renda_valor_4",
                "label": "Outra renda valor 4",
                "wide": false
            },
            {
                "name": "outra_renda_informacoes_4",
                "label": "Outra renda informacoes 4",
                "wide": false
            },
            {
                "name": "sim_cooperativa",
                "label": "Sim cooperativa",
                "wide": false
            },
            {
                "name": "nao_cooperativa",
                "label": "Nao cooperativa",
                "wide": false
            },
            {
                "name": "cooperativa_entidade",
                "label": "Cooperativa entidade",
                "wide": false
            },
            {
                "name": "cooperativa_cnpj",
                "label": "Cooperativa CNPJ",
                "wide": false
            },
            {
                "name": "cooperativa_tipo",
                "label": "Cooperativa tipo",
                "wide": false
            },
            {
                "name": "data",
                "label": "Data",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "nome_beneficio",
                "label": "Nome beneficio",
                "wide": false
            }
        ],
        "modelPaths": {
            "nao": "modelos/Autodeclaracao - SEM REPRESENTACAO.docx",
            "sim": "modelos/Autodeclaracao - COM REPRESENTACAO.docx"
        },
        "fileNames": {
            "nao": "autodeclaracao-sem-representacao.docx",
            "sim": "autodeclaracao-com-representacao.docx"
        },
        "choices": [
            {
                "name": "possui_representacao",
                "label": "A autodeclaração terá representante?",
                "options": [
                    {
                        "value": "nao",
                        "label": "Sem representação"
                    },
                    {
                        "value": "sim",
                        "label": "Com representação"
                    }
                ]
            }
        ]
    },
    {
        "id": "procuracao-consumidor",
        "title": "Procuração Consumidor",
        "description": "Preencha os dados da pessoa, endereço, telefone e data para gerar a procuração consumidor.",
        "category": "procuracoes",
        "fileName": "procuracao-consumidor.docx",
        "fields": [
            {
                "name": "nome_pessoa",
                "label": "Nome completo",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado civil",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/procuracao_consumidor.docx"
    },
    {
        "id": "procuracao-normal",
        "title": "Procuração Normal",
        "description": "Preencha os dados da pessoa, endereço, telefone e data para gerar a procuração normal.",
        "category": "procuracoes",
        "fileName": "procuracao-normal.docx",
        "fields": [
            {
                "name": "nome_pessoa",
                "label": "Nome completo",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado civil",
                "wide": false
            },
            {
                "name": "telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/procuracao_normal.docx"
    },
    {
        "id": "contrato-honorarios-50",
        "title": "Contrato Honorários 50%",
        "description": "Preencha os dados da pessoa, endereço, telefone e data para gerar o contrato de honorários de 50%.",
        "category": "contratos",
        "fileName": "contrato-honorarios-50.docx",
        "fields": [
            {
                "name": "nome_pessoa",
                "label": "Nome completo",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado civil",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/contrato_honorarios_50.docx"
    },
    {
        "id": "contrato-prev-40",
        "title": "Contrato Previdenciário 40%",
        "description": "Preencha os dados da pessoa, endereço, telefone e data para gerar o contrato previdenciário de 40%.",
        "category": "contratos",
        "fileName": "contrato-prev-40.docx",
        "fields": [
            {
                "name": "nome_pessoa",
                "label": "Nome completo",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado civil",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/contrato_prev_40.docx"
    },
    {
        "id": "contrato-prev-30",
        "title": "Contrato Previdenciário 30%",
        "description": "Preencha os dados da pessoa, endereço e data para gerar o contrato previdenciário de 30%.",
        "category": "contratos",
        "fileName": "contrato-prev-30.docx",
        "fields": [
            {
                "name": "nome_pessoa",
                "label": "Nome completo",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado civil",
                "wide": false
            },
            {
                "name": "rg",
                "label": "RG",
                "wide": false
            },
            {
                "name": "cpf",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "endereco",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano",
                "wide": false
            }
        ],
        "modelPath": "modelos/contrato_prev_30.docx"
    },
    {
        "id": "contrato-compra-venda-imovel",
        "title": "Contrato de compra e venda",
        "description": "Preencha vendedor, comprador, dados do imóvel ou bem, valores e assinatura.",
        "category": "contratos",
        "fileName": "contrato-compra-venda.docx",
        "fields": [
            {
                "name": "nome_vendedor",
                "label": "Nome vendedor",
                "wide": false
            },
            {
                "name": "nacionalidade_vendedor",
                "label": "Nacionalidade vendedor",
                "wide": false
            },
            {
                "name": "estado_civil_vendedor",
                "label": "Estado civil vendedor",
                "wide": false
            },
            {
                "name": "rg_vendedor",
                "label": "RG vendedor",
                "wide": false
            },
            {
                "name": "cpf_vendedor",
                "label": "CPF vendedor",
                "wide": false
            },
            {
                "name": "endereco_vendedor",
                "label": "Endereco vendedor",
                "wide": true
            },
            {
                "name": "nome_comprador",
                "label": "Nome comprador",
                "wide": false
            },
            {
                "name": "nacionalidade_comprador",
                "label": "Nacionalidade comprador",
                "wide": false
            },
            {
                "name": "estado_civil_comprador",
                "label": "Estado civil comprador",
                "wide": false
            },
            {
                "name": "rg_comprador",
                "label": "RG comprador",
                "wide": false
            },
            {
                "name": "cpf_comprador",
                "label": "CPF comprador",
                "wide": false
            },
            {
                "name": "endereco_comprador",
                "label": "Endereco comprador",
                "wide": true
            },
            {
                "name": "quantidade_bens",
                "label": "Quantidade bens",
                "wide": false
            },
            {
                "name": "denominacao_imovel",
                "label": "Denominacao imovel",
                "wide": false
            },
            {
                "name": "comprimento_imovel",
                "label": "Comprimento imovel",
                "wide": false
            },
            {
                "name": "largura_imovel",
                "label": "LaRGura imovel",
                "wide": false
            },
            {
                "name": "endereco_imovel",
                "label": "Endereco imovel",
                "wide": true
            },
            {
                "name": "valor_venda",
                "label": "Valor venda",
                "wide": false
            },
            {
                "name": "valor_venda_extenso",
                "label": "Valor venda extenso",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro comarca",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ],
        "modelPath": "modelos/contrato_compra_venda_template_sistema_negrito.docx"
    },
    {
        "id": "contrato-compra-venda-veiculo",
        "title": "Contrato de compra e venda de veículo/bem móvel",
        "description": "Preencha vendedor, comprador, dados do veículo ou bem móvel, pagamento e entrega.",
        "category": "contratos",
        "fileName": "contrato-compra-venda-veiculo-bem-movel.docx",
        "fields": [
            {
                "name": "nome_vendedor",
                "label": "Nome vendedor",
                "wide": false
            },
            {
                "name": "nacionalidade_vendedor",
                "label": "Nacionalidade vendedor",
                "wide": false
            },
            {
                "name": "estado_civil_vendedor",
                "label": "Estado civil vendedor",
                "wide": false
            },
            {
                "name": "rg_vendedor",
                "label": "RG vendedor",
                "wide": false
            },
            {
                "name": "cpf_vendedor",
                "label": "CPF vendedor",
                "wide": false
            },
            {
                "name": "endereco_vendedor",
                "label": "Endereco vendedor",
                "wide": true
            },
            {
                "name": "nome_comprador",
                "label": "Nome comprador",
                "wide": false
            },
            {
                "name": "nacionalidade_comprador",
                "label": "Nacionalidade comprador",
                "wide": false
            },
            {
                "name": "estado_civil_comprador",
                "label": "Estado civil comprador",
                "wide": false
            },
            {
                "name": "rg_comprador",
                "label": "RG comprador",
                "wide": false
            },
            {
                "name": "cpf_comprador",
                "label": "CPF comprador",
                "wide": false
            },
            {
                "name": "endereco_comprador",
                "label": "Endereco comprador",
                "wide": true
            },
            {
                "name": "tipo_bem",
                "label": "Tipo bem",
                "wide": false
            },
            {
                "name": "marca_bem",
                "label": "Marca bem",
                "wide": false
            },
            {
                "name": "modelo_bem",
                "label": "Modelo bem",
                "wide": false
            },
            {
                "name": "ano_modelo_bem",
                "label": "Ano modelo bem",
                "wide": false
            },
            {
                "name": "cor_bem",
                "label": "Cor bem",
                "wide": false
            },
            {
                "name": "placa_veiculo",
                "label": "Placa veiculo",
                "wide": false
            },
            {
                "name": "renavam_veiculo",
                "label": "Renavam veiculo",
                "wide": false
            },
            {
                "name": "chassi_ou_serie",
                "label": "Chassi ou serie",
                "wide": false
            },
            {
                "name": "quilometragem_veiculo",
                "label": "Quilometragem veiculo",
                "wide": false
            },
            {
                "name": "descricao_complementar_bem",
                "label": "Descricao complementar bem",
                "wide": true
            },
            {
                "name": "valor_venda",
                "label": "Valor venda",
                "wide": false
            },
            {
                "name": "valor_venda_extenso",
                "label": "Valor venda extenso",
                "wide": false
            },
            {
                "name": "forma_pagamento",
                "label": "Forma pagamento",
                "wide": false
            },
            {
                "name": "data_assinatura",
                "label": "Data assinatura",
                "wide": false
            },
            {
                "name": "estado_conservacao_bem",
                "label": "Estado conservacao bem",
                "wide": false
            },
            {
                "name": "local_entrega_bem",
                "label": "Local entrega bem",
                "wide": false
            },
            {
                "name": "data_entrega_bem",
                "label": "Data entrega bem",
                "wide": false
            },
            {
                "name": "responsavel_transferencia",
                "label": "Responsavel transferencia",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro comarca",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            },
            {
                "name": "cpf_testemunha_1",
                "label": "CPF testemunha 1",
                "wide": false
            },
            {
                "name": "cpf_testemunha_2",
                "label": "CPF testemunha 2",
                "wide": false
            }
        ],
        "modelPath": "modelos/contrato_compra_venda_veiculo_bem_movel_template.docx"
    },
    {
        "id": "cadastro-confrontantes",
        "title": "Cadastro de confrontantes",
        "description": "Informe declarante, imovel rural e confrontantes ao norte, sul, leste e oeste.",
        "category": "rural",
        "modelPath": "modelos/cadastro_confrontantes_template(1).docx",
        "fileName": "cadastro-confrontantes.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome imovel rural",
                "wide": false
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco imovel rural",
                "wide": true
            },
            {
                "name": "municipio_imovel",
                "label": "Municipio imovel",
                "wide": false
            },
            {
                "name": "uf_imovel",
                "label": "UF imovel",
                "wide": false
            },
            {
                "name": "area_imovel",
                "label": "Area imovel",
                "wide": false
            },
            {
                "name": "registro_imovel",
                "label": "Registro imovel",
                "wide": false
            },
            {
                "name": "nome_confrontante_norte",
                "label": "Nome confrontante norte",
                "wide": true
            },
            {
                "name": "cpf_cnpj_confrontante_norte",
                "label": "CPF CNPJ confrontante norte",
                "wide": true
            },
            {
                "name": "imovel_confrontante_norte",
                "label": "Imovel confrontante norte",
                "wide": true
            },
            {
                "name": "endereco_confrontante_norte",
                "label": "Endereco confrontante norte",
                "wide": true
            },
            {
                "name": "nome_confrontante_sul",
                "label": "Nome confrontante sul",
                "wide": true
            },
            {
                "name": "cpf_cnpj_confrontante_sul",
                "label": "CPF CNPJ confrontante sul",
                "wide": true
            },
            {
                "name": "imovel_confrontante_sul",
                "label": "Imovel confrontante sul",
                "wide": true
            },
            {
                "name": "endereco_confrontante_sul",
                "label": "Endereco confrontante sul",
                "wide": true
            },
            {
                "name": "nome_confrontante_leste",
                "label": "Nome confrontante leste",
                "wide": true
            },
            {
                "name": "cpf_cnpj_confrontante_leste",
                "label": "CPF CNPJ confrontante leste",
                "wide": true
            },
            {
                "name": "imovel_confrontante_leste",
                "label": "Imovel confrontante leste",
                "wide": true
            },
            {
                "name": "endereco_confrontante_leste",
                "label": "Endereco confrontante leste",
                "wide": true
            },
            {
                "name": "nome_confrontante_oeste",
                "label": "Nome confrontante oeste",
                "wide": true
            },
            {
                "name": "cpf_cnpj_confrontante_oeste",
                "label": "CPF CNPJ confrontante oeste",
                "wide": true
            },
            {
                "name": "imovel_confrontante_oeste",
                "label": "Imovel confrontante oeste",
                "wide": true
            },
            {
                "name": "endereco_confrontante_oeste",
                "label": "Endereco confrontante oeste",
                "wide": true
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "controle-producao-anual",
        "title": "Controle de producao anual",
        "description": "Registre produtos, quantidades, vendas, despesas e receita anual da producao rural.",
        "category": "rural",
        "modelPath": "modelos/controle_producao_anual_template(1).docx",
        "fileName": "controle-producao-anual.docx",
        "fields": [
            {
                "name": "nome_produtor",
                "label": "Nome produtor",
                "wide": true
            },
            {
                "name": "nacionalidade_produtor",
                "label": "Nacionalidade produtor",
                "wide": true
            },
            {
                "name": "estado_civil_produtor",
                "label": "Estado civil produtor",
                "wide": true
            },
            {
                "name": "rg_produtor",
                "label": "RG produtor",
                "wide": true
            },
            {
                "name": "cpf_produtor",
                "label": "CPF produtor",
                "wide": true
            },
            {
                "name": "endereco_produtor",
                "label": "Endereco produtor",
                "wide": true
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome imovel rural",
                "wide": false
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco imovel rural",
                "wide": true
            },
            {
                "name": "municipio_imovel",
                "label": "Municipio imovel",
                "wide": false
            },
            {
                "name": "uf_imovel",
                "label": "UF imovel",
                "wide": false
            },
            {
                "name": "area_imovel",
                "label": "Area imovel",
                "wide": false
            },
            {
                "name": "registro_rural",
                "label": "Registro rural",
                "wide": false
            },
            {
                "name": "ano_referencia",
                "label": "Ano referencia",
                "wide": false
            },
            {
                "name": "data_inicio_ano",
                "label": "Data inicio ano",
                "wide": false
            },
            {
                "name": "data_fim_ano",
                "label": "Data fim ano",
                "wide": false
            },
            {
                "name": "atividade_1",
                "label": "Atividade 1",
                "wide": true
            },
            {
                "name": "quantidade_produzida_1",
                "label": "Quantidade produzida 1",
                "wide": false
            },
            {
                "name": "unidade_1",
                "label": "Unidade 1",
                "wide": false
            },
            {
                "name": "quantidade_vendida_1",
                "label": "Quantidade vendida 1",
                "wide": false
            },
            {
                "name": "estoque_final_1",
                "label": "Estoque final 1",
                "wide": false
            },
            {
                "name": "valor_total_1",
                "label": "Valor total 1",
                "wide": false
            },
            {
                "name": "atividade_2",
                "label": "Atividade 2",
                "wide": true
            },
            {
                "name": "quantidade_produzida_2",
                "label": "Quantidade produzida 2",
                "wide": false
            },
            {
                "name": "unidade_2",
                "label": "Unidade 2",
                "wide": false
            },
            {
                "name": "quantidade_vendida_2",
                "label": "Quantidade vendida 2",
                "wide": false
            },
            {
                "name": "estoque_final_2",
                "label": "Estoque final 2",
                "wide": false
            },
            {
                "name": "valor_total_2",
                "label": "Valor total 2",
                "wide": false
            },
            {
                "name": "atividade_3",
                "label": "Atividade 3",
                "wide": true
            },
            {
                "name": "quantidade_produzida_3",
                "label": "Quantidade produzida 3",
                "wide": false
            },
            {
                "name": "unidade_3",
                "label": "Unidade 3",
                "wide": false
            },
            {
                "name": "quantidade_vendida_3",
                "label": "Quantidade vendida 3",
                "wide": false
            },
            {
                "name": "estoque_final_3",
                "label": "Estoque final 3",
                "wide": false
            },
            {
                "name": "valor_total_3",
                "label": "Valor total 3",
                "wide": false
            },
            {
                "name": "receita_bruta_anual",
                "label": "Receita bruta anual",
                "wide": false
            },
            {
                "name": "receita_bruta_extenso",
                "label": "Receita bruta extenso",
                "wide": false
            },
            {
                "name": "despesas_anuais",
                "label": "Despesas anuais",
                "wide": false
            },
            {
                "name": "despesas_anuais_extenso",
                "label": "Despesas anuais extenso",
                "wide": false
            },
            {
                "name": "saldo_estimado",
                "label": "Saldo estimado",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "controle-rebanho",
        "title": "Controle de rebanho",
        "description": "Controle entradas, saidas, quantidade final, vacinacao e identificacao do rebanho.",
        "category": "rural",
        "modelPath": "modelos/controle_rebanho_template(1).docx",
        "fileName": "controle-rebanho.docx",
        "fields": [
            {
                "name": "nome_produtor",
                "label": "Nome produtor",
                "wide": true
            },
            {
                "name": "nacionalidade_produtor",
                "label": "Nacionalidade produtor",
                "wide": true
            },
            {
                "name": "estado_civil_produtor",
                "label": "Estado civil produtor",
                "wide": true
            },
            {
                "name": "rg_produtor",
                "label": "RG produtor",
                "wide": true
            },
            {
                "name": "cpf_produtor",
                "label": "CPF produtor",
                "wide": true
            },
            {
                "name": "endereco_produtor",
                "label": "Endereco produtor",
                "wide": true
            },
            {
                "name": "nome_propriedade",
                "label": "Nome propriedade",
                "wide": false
            },
            {
                "name": "endereco_propriedade",
                "label": "Endereco propriedade",
                "wide": true
            },
            {
                "name": "municipio_propriedade",
                "label": "Municipio propriedade",
                "wide": false
            },
            {
                "name": "uf_propriedade",
                "label": "UF propriedade",
                "wide": false
            },
            {
                "name": "registro_propriedade",
                "label": "Registro propriedade",
                "wide": false
            },
            {
                "name": "data_inicio_controle",
                "label": "Data inicio controle",
                "wide": false
            },
            {
                "name": "data_fim_controle",
                "label": "Data fim controle",
                "wide": false
            },
            {
                "name": "ano_controle",
                "label": "Ano controle",
                "wide": false
            },
            {
                "name": "especie_1",
                "label": "Especie 1",
                "wide": false
            },
            {
                "name": "categoria_1",
                "label": "Categoria 1",
                "wide": false
            },
            {
                "name": "quantidade_inicial_1",
                "label": "Quantidade inicial 1",
                "wide": false
            },
            {
                "name": "entradas_1",
                "label": "Entradas 1",
                "wide": false
            },
            {
                "name": "saidas_1",
                "label": "Saidas 1",
                "wide": false
            },
            {
                "name": "quantidade_final_1",
                "label": "Quantidade final 1",
                "wide": false
            },
            {
                "name": "especie_2",
                "label": "Especie 2",
                "wide": false
            },
            {
                "name": "categoria_2",
                "label": "Categoria 2",
                "wide": false
            },
            {
                "name": "quantidade_inicial_2",
                "label": "Quantidade inicial 2",
                "wide": false
            },
            {
                "name": "entradas_2",
                "label": "Entradas 2",
                "wide": false
            },
            {
                "name": "saidas_2",
                "label": "Saidas 2",
                "wide": false
            },
            {
                "name": "quantidade_final_2",
                "label": "Quantidade final 2",
                "wide": false
            },
            {
                "name": "especie_3",
                "label": "Especie 3",
                "wide": false
            },
            {
                "name": "categoria_3",
                "label": "Categoria 3",
                "wide": false
            },
            {
                "name": "quantidade_inicial_3",
                "label": "Quantidade inicial 3",
                "wide": false
            },
            {
                "name": "entradas_3",
                "label": "Entradas 3",
                "wide": false
            },
            {
                "name": "saidas_3",
                "label": "Saidas 3",
                "wide": false
            },
            {
                "name": "quantidade_final_3",
                "label": "Quantidade final 3",
                "wide": false
            },
            {
                "name": "total_nascimentos",
                "label": "Total nascimentos",
                "wide": false
            },
            {
                "name": "total_compras",
                "label": "Total compras",
                "wide": false
            },
            {
                "name": "total_vendas",
                "label": "Total vendas",
                "wide": false
            },
            {
                "name": "total_mortes",
                "label": "Total mortes",
                "wide": false
            },
            {
                "name": "total_transferencias",
                "label": "Total transferencias",
                "wide": false
            },
            {
                "name": "controle_sanitario",
                "label": "Controle sanitario",
                "wide": false
            },
            {
                "name": "vacinacao_rebanho",
                "label": "Vacinacao rebanho",
                "wide": false
            },
            {
                "name": "forma_identificacao",
                "label": "Forma identificacao",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "inventario-producao-rural",
        "title": "Inventario de producao rural",
        "description": "Liste produtos, areas, quantidades, valores e destino da producao rural.",
        "category": "rural",
        "modelPath": "modelos/inventario_producao_rural_template.docx",
        "fileName": "inventario-producao-rural.docx",
        "fields": [
            {
                "name": "nome_produtor",
                "label": "Nome produtor",
                "wide": true
            },
            {
                "name": "nacionalidade_produtor",
                "label": "Nacionalidade produtor",
                "wide": true
            },
            {
                "name": "estado_civil_produtor",
                "label": "Estado civil produtor",
                "wide": true
            },
            {
                "name": "rg_produtor",
                "label": "RG produtor",
                "wide": true
            },
            {
                "name": "cpf_produtor",
                "label": "CPF produtor",
                "wide": true
            },
            {
                "name": "endereco_produtor",
                "label": "Endereco produtor",
                "wide": true
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome imovel rural",
                "wide": false
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco imovel rural",
                "wide": true
            },
            {
                "name": "municipio_imovel",
                "label": "Municipio imovel",
                "wide": false
            },
            {
                "name": "uf_imovel",
                "label": "UF imovel",
                "wide": false
            },
            {
                "name": "area_imovel",
                "label": "Area imovel",
                "wide": false
            },
            {
                "name": "registro_rural",
                "label": "Registro rural",
                "wide": false
            },
            {
                "name": "data_inicio_periodo",
                "label": "Data inicio periodo",
                "wide": false
            },
            {
                "name": "data_fim_periodo",
                "label": "Data fim periodo",
                "wide": false
            },
            {
                "name": "ano_safra",
                "label": "Ano safra",
                "wide": false
            },
            {
                "name": "produto_1",
                "label": "Produto 1",
                "wide": true
            },
            {
                "name": "area_produto_1",
                "label": "Area produto 1",
                "wide": true
            },
            {
                "name": "quantidade_produto_1",
                "label": "Quantidade produto 1",
                "wide": true
            },
            {
                "name": "unidade_produto_1",
                "label": "Unidade produto 1",
                "wide": true
            },
            {
                "name": "valor_produto_1",
                "label": "Valor produto 1",
                "wide": true
            },
            {
                "name": "produto_2",
                "label": "Produto 2",
                "wide": true
            },
            {
                "name": "area_produto_2",
                "label": "Area produto 2",
                "wide": true
            },
            {
                "name": "quantidade_produto_2",
                "label": "Quantidade produto 2",
                "wide": true
            },
            {
                "name": "unidade_produto_2",
                "label": "Unidade produto 2",
                "wide": true
            },
            {
                "name": "valor_produto_2",
                "label": "Valor produto 2",
                "wide": true
            },
            {
                "name": "produto_3",
                "label": "Produto 3",
                "wide": true
            },
            {
                "name": "area_produto_3",
                "label": "Area produto 3",
                "wide": true
            },
            {
                "name": "quantidade_produto_3",
                "label": "Quantidade produto 3",
                "wide": true
            },
            {
                "name": "unidade_produto_3",
                "label": "Unidade produto 3",
                "wide": true
            },
            {
                "name": "valor_produto_3",
                "label": "Valor produto 3",
                "wide": true
            },
            {
                "name": "local_armazenamento",
                "label": "Local armazenamento",
                "wide": false
            },
            {
                "name": "destino_producao",
                "label": "Destino producao",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "contrato-arrendamento-rural",
        "title": "Contrato de arrendamento rural",
        "description": "Preencha arrendador, arrendatario, imovel, prazo, pagamento e foro.",
        "category": "contratos",
        "modelPath": "modelos/contrato_arrendamento_rural_template.docx",
        "fileName": "contrato-arrendamento-rural.docx",
        "fields": [
            {
                "name": "nome_arrendador",
                "label": "Nome arrendador",
                "wide": false
            },
            {
                "name": "nacionalidade_arrendador",
                "label": "Nacionalidade arrendador",
                "wide": false
            },
            {
                "name": "estado_civil_arrendador",
                "label": "Estado civil arrendador",
                "wide": false
            },
            {
                "name": "profissao_arrendador",
                "label": "Profissao arrendador",
                "wide": false
            },
            {
                "name": "rg_arrendador",
                "label": "RG arrendador",
                "wide": false
            },
            {
                "name": "cpf_cnpj_arrendador",
                "label": "CPF CNPJ arrendador",
                "wide": false
            },
            {
                "name": "endereco_arrendador",
                "label": "Endereco arrendador",
                "wide": true
            },
            {
                "name": "nome_arrendatario",
                "label": "Nome arrendatario",
                "wide": false
            },
            {
                "name": "nacionalidade_arrendatario",
                "label": "Nacionalidade arrendatario",
                "wide": false
            },
            {
                "name": "estado_civil_arrendatario",
                "label": "Estado civil arrendatario",
                "wide": false
            },
            {
                "name": "profissao_arrendatario",
                "label": "Profissao arrendatario",
                "wide": false
            },
            {
                "name": "rg_arrendatario",
                "label": "RG arrendatario",
                "wide": false
            },
            {
                "name": "cpf_cnpj_arrendatario",
                "label": "CPF CNPJ arrendatario",
                "wide": false
            },
            {
                "name": "endereco_arrendatario",
                "label": "Endereco arrendatario",
                "wide": true
            },
            {
                "name": "denominacao_imovel",
                "label": "Denominacao imovel",
                "wide": false
            },
            {
                "name": "area_total_ha",
                "label": "Area total ha",
                "wide": false
            },
            {
                "name": "localizacao_imovel",
                "label": "Localizacao imovel",
                "wide": false
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "uf",
                "label": "UF",
                "wide": false
            },
            {
                "name": "matricula_imovel",
                "label": "Matricula imovel",
                "wide": false
            },
            {
                "name": "ccir_incra",
                "label": "Ccir incra",
                "wide": false
            },
            {
                "name": "car_imovel",
                "label": "Car imovel",
                "wide": false
            },
            {
                "name": "confrontacoes_imovel",
                "label": "Confrontacoes imovel",
                "wide": true
            },
            {
                "name": "finalidade_arrendamento",
                "label": "Finalidade arrendamento",
                "wide": true
            },
            {
                "name": "prazo_arrendamento",
                "label": "Prazo arrendamento",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início",
                "wide": false
            },
            {
                "name": "data_fim",
                "label": "Data fim",
                "wide": false
            },
            {
                "name": "valor_arrendamento",
                "label": "Valor arrendamento",
                "wide": false
            },
            {
                "name": "valor_arrendamento_extenso",
                "label": "Valor arrendamento extenso",
                "wide": false
            },
            {
                "name": "dia_vencimento",
                "label": "Dia vencimento",
                "wide": false
            },
            {
                "name": "periodicidade_pagamento",
                "label": "Periodicidade pagamento",
                "wide": false
            },
            {
                "name": "forma_pagamento",
                "label": "Forma pagamento",
                "wide": false
            },
            {
                "name": "indice_reajuste",
                "label": "Indice reajuste",
                "wide": false
            },
            {
                "name": "prazo_inadimplencia",
                "label": "Prazo inadimplencia",
                "wide": false
            },
            {
                "name": "prazo_aviso_rescisao",
                "label": "Prazo aviso rescisao",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro comarca",
                "wide": false
            },
            {
                "name": "foro_uf",
                "label": "Foro UF",
                "wide": false
            },
            {
                "name": "numero_vias",
                "label": "Numero vias",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "contrato-comodato-equipamentos",
        "title": "Contrato de comodato de equipamentos",
        "description": "Preencha comodante, comodatario, equipamentos, acessorios, prazo e responsabilidades.",
        "category": "contratos",
        "modelPath": "modelos/contrato_comodato_equipamentos_template.docx",
        "fileName": "contrato-comodato-equipamentos.docx",
        "fields": [
            {
                "name": "nome_comodante",
                "label": "Nome comodante",
                "wide": false
            },
            {
                "name": "nacionalidade_comodante",
                "label": "Nacionalidade comodante",
                "wide": false
            },
            {
                "name": "estado_civil_comodante",
                "label": "Estado civil comodante",
                "wide": false
            },
            {
                "name": "profissao_comodante",
                "label": "Profissao comodante",
                "wide": false
            },
            {
                "name": "rg_comodante",
                "label": "RG comodante",
                "wide": false
            },
            {
                "name": "cpf_cnpj_comodante",
                "label": "CPF CNPJ comodante",
                "wide": false
            },
            {
                "name": "endereco_comodante",
                "label": "Endereco comodante",
                "wide": true
            },
            {
                "name": "nome_comodatario",
                "label": "Nome completo do comodatário",
                "wide": false
            },
            {
                "name": "nacionalidade_comodatario",
                "label": "Nacionalidade comodatario",
                "wide": false
            },
            {
                "name": "estado_civil_comodatario",
                "label": "Estado civil do comodatário",
                "wide": false
            },
            {
                "name": "profissao_comandatario",
                "label": "Profissao comodatario",
                "wide": false
            },
            {
                "name": "rg_comodatario",
                "label": "RG do comodatário",
                "wide": false
            },
            {
                "name": "cpf_cnpj_comodatario",
                "label": "CPF CNPJ comodatario",
                "wide": false
            },
            {
                "name": "endereco_comodatario",
                "label": "Endereco comodatario",
                "wide": true
            },
            {
                "name": "finalidade_uso_equipamento",
                "label": "Finalidade uso equipamento",
                "wide": true
            },
            {
                "name": "equipamento_1",
                "label": "Equipamento 1",
                "wide": false
            },
            {
                "name": "marca_modelo_1",
                "label": "Marca modelo 1",
                "wide": false
            },
            {
                "name": "serie_chassi_1",
                "label": "Serie chassi 1",
                "wide": false
            },
            {
                "name": "estado_conservacao_1",
                "label": "Estado conservacao 1",
                "wide": false
            },
            {
                "name": "acessorios_1",
                "label": "Acessorios 1",
                "wide": false
            },
            {
                "name": "equipamento_2",
                "label": "Equipamento 2",
                "wide": false
            },
            {
                "name": "marca_modelo_2",
                "label": "Marca modelo 2",
                "wide": false
            },
            {
                "name": "serie_chassi_2",
                "label": "Serie chassi 2",
                "wide": false
            },
            {
                "name": "estado_conservacao_2",
                "label": "Estado conservacao 2",
                "wide": false
            },
            {
                "name": "acessorios_2",
                "label": "Acessorios 2",
                "wide": false
            },
            {
                "name": "equipamento_3",
                "label": "Equipamento 3",
                "wide": false
            },
            {
                "name": "marca_modelo_3",
                "label": "Marca modelo 3",
                "wide": false
            },
            {
                "name": "serie_chassi_3",
                "label": "Serie chassi 3",
                "wide": false
            },
            {
                "name": "estado_conservacao_3",
                "label": "Estado conservacao 3",
                "wide": false
            },
            {
                "name": "acessorios_3",
                "label": "Acessorios 3",
                "wide": false
            },
            {
                "name": "prazo_comodato",
                "label": "Prazo comodato",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início",
                "wide": false
            },
            {
                "name": "data_fim",
                "label": "Data fim",
                "wide": false
            },
            {
                "name": "responsavel_despesas",
                "label": "Responsavel despesas",
                "wide": false
            },
            {
                "name": "regra_manutencao_extraordinaria",
                "label": "Regra manutencao extraordinaria",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro comarca",
                "wide": false
            },
            {
                "name": "foro_uf",
                "label": "Foro UF",
                "wide": false
            },
            {
                "name": "numero_vias",
                "label": "Numero vias",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "contrato-parceria-rural",
        "title": "Contrato de parceria rural",
        "description": "Preencha outorgante, outorgado, area, atividade, percentuais, despesas e foro.",
        "category": "contratos",
        "modelPath": "modelos/contrato_parceria_rural_template.docx",
        "fileName": "contrato-parceria-rural.docx",
        "fields": [
            {
                "name": "nome_outorgante",
                "label": "Nome outoRGante",
                "wide": false
            },
            {
                "name": "nacionalidade_outorgante",
                "label": "Nacionalidade outoRGante",
                "wide": false
            },
            {
                "name": "estado_civil_outorgante",
                "label": "Estado civil outoRGante",
                "wide": false
            },
            {
                "name": "profissao_outorgante",
                "label": "Profissao outoRGante",
                "wide": false
            },
            {
                "name": "rg_outorgante",
                "label": "RG outoRGante",
                "wide": false
            },
            {
                "name": "cpf_cnpj_outorgante",
                "label": "CPF CNPJ outoRGante",
                "wide": false
            },
            {
                "name": "endereco_outorgante",
                "label": "Endereco outoRGante",
                "wide": true
            },
            {
                "name": "nome_outorgado",
                "label": "Nome outoRGado",
                "wide": false
            },
            {
                "name": "nacionalidade_outorgado",
                "label": "Nacionalidade outoRGado",
                "wide": false
            },
            {
                "name": "estado_civil_outorgado",
                "label": "Estado civil outoRGado",
                "wide": false
            },
            {
                "name": "profissao_outorgado",
                "label": "Profissao outoRGado",
                "wide": false
            },
            {
                "name": "rg_outorgado",
                "label": "RG outoRGado",
                "wide": false
            },
            {
                "name": "cpf_cnpj_outorgado",
                "label": "CPF CNPJ outoRGado",
                "wide": false
            },
            {
                "name": "endereco_outorgado",
                "label": "Endereco outoRGado",
                "wide": true
            },
            {
                "name": "denominacao_area",
                "label": "Denominacao area",
                "wide": false
            },
            {
                "name": "area_parceria_ha",
                "label": "Area parceria ha",
                "wide": false
            },
            {
                "name": "localizacao_area",
                "label": "Localizacao area",
                "wide": false
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "uf",
                "label": "UF",
                "wide": false
            },
            {
                "name": "matricula_area",
                "label": "Matricula area",
                "wide": false
            },
            {
                "name": "atividade_parceria",
                "label": "Atividade parceria",
                "wide": true
            },
            {
                "name": "descricao_atividade",
                "label": "Descricao atividade",
                "wide": true
            },
            {
                "name": "percentual_outorgante",
                "label": "Percentual outoRGante",
                "wide": false
            },
            {
                "name": "percentual_outorgado",
                "label": "Percentual outoRGado",
                "wide": false
            },
            {
                "name": "periodicidade_apuracao",
                "label": "Periodicidade apuracao",
                "wide": false
            },
            {
                "name": "divisao_despesas",
                "label": "Divisao despesas",
                "wide": false
            },
            {
                "name": "prazo_parceria",
                "label": "Prazo parceria",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início",
                "wide": false
            },
            {
                "name": "data_fim",
                "label": "Data fim",
                "wide": false
            },
            {
                "name": "periodicidade_prestacao_contas",
                "label": "Periodicidade prestacao contas",
                "wide": false
            },
            {
                "name": "prazo_aviso_rescisao",
                "label": "Prazo aviso rescisao",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro comarca",
                "wide": false
            },
            {
                "name": "foro_uf",
                "label": "Foro UF",
                "wide": false
            },
            {
                "name": "numero_vias",
                "label": "Numero vias",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-posse-mansa-pacifica",
        "title": "Declaracao de posse mansa e pacifica",
        "description": "Declare posse, localizacao, confrontantes, finalidade de uso e benfeitorias.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_posse_mansa_pacifica_template.docx",
        "fileName": "declaracao-posse-mansa-pacifica.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_cnpj_declarante",
                "label": "CPF CNPJ declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "denominacao_imovel",
                "label": "Denominacao imovel",
                "wide": false
            },
            {
                "name": "localizacao_imovel",
                "label": "Localizacao imovel",
                "wide": false
            },
            {
                "name": "municipio",
                "label": "Município",
                "wide": false
            },
            {
                "name": "uf",
                "label": "UF",
                "wide": false
            },
            {
                "name": "area_aproximada",
                "label": "Area aproximada",
                "wide": false
            },
            {
                "name": "coordenadas_referencia",
                "label": "Coordenadas referencia",
                "wide": false
            },
            {
                "name": "confrontante_norte",
                "label": "Confrontante norte",
                "wide": true
            },
            {
                "name": "confrontante_sul",
                "label": "Confrontante sul",
                "wide": true
            },
            {
                "name": "confrontante_leste",
                "label": "Confrontante leste",
                "wide": true
            },
            {
                "name": "confrontante_oeste",
                "label": "Confrontante oeste",
                "wide": true
            },
            {
                "name": "data_inicio_posse",
                "label": "Data inicio posse",
                "wide": false
            },
            {
                "name": "finalidade_uso",
                "label": "Finalidade uso",
                "wide": true
            },
            {
                "name": "benfeitorias_atividades",
                "label": "Benfeitorias atividades",
                "wide": true
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-residencia",
        "title": "Declaracao de residencia",
        "description": "Informe residencia, titular do comprovante, orgao de destino e data.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_residencia_template.docx",
        "fileName": "declaracao-residencia.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "endereco_residencia",
                "label": "Endereco residencia",
                "wide": true
            },
            {
                "name": "bairro_residencia",
                "label": "Bairro residencia",
                "wide": false
            },
            {
                "name": "cidade_residencia",
                "label": "Cidade residencia",
                "wide": false
            },
            {
                "name": "uf_residencia",
                "label": "UF residencia",
                "wide": false
            },
            {
                "name": "cep_residencia",
                "label": "Cep residencia",
                "wide": false
            },
            {
                "name": "data_inicio_residencia",
                "label": "Data inicio residencia",
                "wide": false
            },
            {
                "name": "nome_titular_comprovante",
                "label": "Nome titular comprovante",
                "wide": false
            },
            {
                "name": "cpf_titular_comprovante",
                "label": "CPF titular comprovante",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-nao-possuir-renda",
        "title": "Declaracao de nao possuir renda",
        "description": "Informe declarante, forma de manutencao, ajuda eventual e orgao de destino.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_nao_possuir_renda_template.docx",
        "fileName": "declaracao-nao-possuir-renda.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "valor_ajuda_eventual",
                "label": "Valor ajuda eventual",
                "wide": false
            },
            {
                "name": "forma_manutencao",
                "label": "Forma manutencao",
                "wide": false
            },
            {
                "name": "nome_responsavel_ajuda",
                "label": "Nome responsavel ajuda",
                "wide": false
            },
            {
                "name": "cpf_responsavel_ajuda",
                "label": "CPF responsavel ajuda",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-agricultura-familiar",
        "title": "Declaracao de agricultura familiar",
        "description": "Informe atividade em agricultura familiar, imovel rural, produtos e membros familiares.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_exercicio_agricultura_familiar_template.docx",
        "fileName": "declaracao-agricultura-familiar.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome imovel rural",
                "wide": false
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco imovel rural",
                "wide": true
            },
            {
                "name": "municipio_imovel_rural",
                "label": "Municipio imovel rural",
                "wide": false
            },
            {
                "name": "uf_imovel_rural",
                "label": "UF imovel rural",
                "wide": false
            },
            {
                "name": "produtos_agricultura_familiar",
                "label": "Produtos agricultura familiar",
                "wide": true
            },
            {
                "name": "membros_familiares_atividade",
                "label": "Membros familiares atividade",
                "wide": true
            },
            {
                "name": "fonte_renda_agricultura_familiar",
                "label": "Fonte renda agricultura familiar",
                "wide": false
            },
            {
                "name": "data_inicio_agricultura_familiar",
                "label": "Data inicio agricultura familiar",
                "wide": false
            },
            {
                "name": "area_explorada",
                "label": "Area explorada",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-dependencia-economica",
        "title": "Declaracao de dependencia economica",
        "description": "Informe declarante, dependente, parentesco, renda e motivo da dependencia.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_dependencia_economica_template.docx",
        "fileName": "declaracao-dependencia-economica.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "nome_dependente",
                "label": "Nome dependente",
                "wide": false
            },
            {
                "name": "parentesco_dependente",
                "label": "Parentesco dependente",
                "wide": false
            },
            {
                "name": "cpf_dependente",
                "label": "CPF dependente",
                "wide": false
            },
            {
                "name": "data_inicio_dependencia",
                "label": "Data inicio dependencia",
                "wide": false
            },
            {
                "name": "motivo_dependencia",
                "label": "Motivo dependencia",
                "wide": false
            },
            {
                "name": "renda_dependente",
                "label": "Renda dependente",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-convivencia-familiar",
        "title": "Declaracao de convivencia familiar",
        "description": "Informe convivencia familiar, parentesco, endereco e finalidade da declaracao.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_convivencia_familiar_template.docx",
        "fileName": "declaracao-convivencia-familiar.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "nome_familiar_convivente",
                "label": "Nome familiar convivente",
                "wide": false
            },
            {
                "name": "cpf_familiar_convivente",
                "label": "CPF familiar convivente",
                "wide": false
            },
            {
                "name": "grau_parentesco_convivente",
                "label": "Grau parentesco convivente",
                "wide": false
            },
            {
                "name": "data_inicio_convivencia",
                "label": "Data inicio convivencia",
                "wide": false
            },
            {
                "name": "endereco_convivencia_familiar",
                "label": "Endereco convivencia familiar",
                "wide": true
            },
            {
                "name": "finalidade_declaracao",
                "label": "Finalidade declaracao",
                "wide": true
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-baixa-renda",
        "title": "Declaracao de baixa renda",
        "description": "Informe renda individual, renda familiar, membros da familia e orgao de destino.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_baixa_renda_template.docx",
        "fileName": "declaracao-baixa-renda.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "renda_mensal_individual",
                "label": "Renda mensal individual",
                "wide": false
            },
            {
                "name": "renda_familiar_mensal",
                "label": "Renda familiar mensal",
                "wide": false
            },
            {
                "name": "quantidade_membros_familiares",
                "label": "Quantidade membros familiares",
                "wide": true
            },
            {
                "name": "nomes_membros_familiares",
                "label": "Nomes membros familiares",
                "wide": true
            },
            {
                "name": "renda_per_capita",
                "label": "Renda per capita",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-autenticidade-documentos",
        "title": "Declaracao de autenticidade de documentos",
        "description": "Declare a autenticidade dos documentos apresentados ao orgao de destino.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_autenticidade_documentos_template.docx",
        "fileName": "declaracao-autenticidade-documentos.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "lista_documentos_autenticados",
                "label": "Lista documentos autenticados",
                "wide": true
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-atividade-rural",
        "title": "Declaracao de atividade rural",
        "description": "Informe periodo, funcao rural, forma de exercicio, imovel e renda media.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_atividade_rural_template.docx",
        "fileName": "declaracao-atividade-rural.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "funcao_rural",
                "label": "Funcao rural",
                "wide": false
            },
            {
                "name": "descricao_atividade_rural",
                "label": "Descricao atividade rural",
                "wide": true
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome imovel rural",
                "wide": false
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco imovel rural",
                "wide": true
            },
            {
                "name": "municipio_imovel_rural",
                "label": "Municipio imovel rural",
                "wide": false
            },
            {
                "name": "uf_imovel_rural",
                "label": "UF imovel rural",
                "wide": false
            },
            {
                "name": "data_inicio_atividade_rural",
                "label": "Data inicio atividade rural",
                "wide": true
            },
            {
                "name": "data_fim_atividade_rural",
                "label": "Data fim atividade rural",
                "wide": true
            },
            {
                "name": "forma_exercicio_atividade",
                "label": "Forma exercicio atividade",
                "wide": true
            },
            {
                "name": "renda_media_rural",
                "label": "Renda media rural",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-uniao-estavel",
        "title": "Declaracao de uniao estavel",
        "description": "Informe os conviventes, residencia do casal, inicio da uniao e regime de bens.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_uniao_estavel_template.docx",
        "fileName": "declaracao-uniao-estavel.docx",
        "fields": [
            {
                "name": "nome_convivente_1",
                "label": "Nome convivente 1",
                "wide": false
            },
            {
                "name": "nacionalidade_convivente_1",
                "label": "Nacionalidade convivente 1",
                "wide": false
            },
            {
                "name": "estado_civil_convivente_1",
                "label": "Estado civil convivente 1",
                "wide": false
            },
            {
                "name": "profissao_convivente_1",
                "label": "Profissao convivente 1",
                "wide": false
            },
            {
                "name": "rg_convivente_1",
                "label": "RG convivente 1",
                "wide": false
            },
            {
                "name": "cpf_convivente_1",
                "label": "CPF convivente 1",
                "wide": false
            },
            {
                "name": "endereco_convivente_1",
                "label": "Endereco convivente 1",
                "wide": true
            },
            {
                "name": "nome_convivente_2",
                "label": "Nome convivente 2",
                "wide": false
            },
            {
                "name": "nacionalidade_convivente_2",
                "label": "Nacionalidade convivente 2",
                "wide": false
            },
            {
                "name": "estado_civil_convivente_2",
                "label": "Estado civil convivente 2",
                "wide": false
            },
            {
                "name": "profissao_convivente_2",
                "label": "Profissao convivente 2",
                "wide": false
            },
            {
                "name": "rg_convivente_2",
                "label": "RG convivente 2",
                "wide": false
            },
            {
                "name": "cpf_convivente_2",
                "label": "CPF convivente 2",
                "wide": false
            },
            {
                "name": "endereco_convivente_2",
                "label": "Endereco convivente 2",
                "wide": true
            },
            {
                "name": "data_inicio_uniao_estavel",
                "label": "Data inicio uniao estavel",
                "wide": false
            },
            {
                "name": "endereco_residencia_casal",
                "label": "Endereco residencia casal",
                "wide": true
            },
            {
                "name": "regime_bens_uniao",
                "label": "Regime bens uniao",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    },
    {
        "id": "declaracao-tempo-trabalho-rural",
        "title": "Declaracao de tempo de trabalho rural",
        "description": "Informe periodo de trabalho rural, propriedade, responsavel e atividades desempenhadas.",
        "category": "declaracoes",
        "modelPath": "modelos/declaracao_tempo_trabalho_rural_template.docx",
        "fileName": "declaracao-tempo-trabalho-rural.docx",
        "fields": [
            {
                "name": "nome_declarante",
                "label": "Nome declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade declarante",
                "wide": false
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado civil declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG declarante",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF declarante",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco declarante",
                "wide": true
            },
            {
                "name": "data_inicio_trabalho_rural",
                "label": "Data inicio trabalho rural",
                "wide": false
            },
            {
                "name": "data_fim_trabalho_rural",
                "label": "Data fim trabalho rural",
                "wide": false
            },
            {
                "name": "nome_propriedade_rural",
                "label": "Nome propriedade rural",
                "wide": false
            },
            {
                "name": "endereco_propriedade_rural",
                "label": "Endereco propriedade rural",
                "wide": true
            },
            {
                "name": "municipio_propriedade_rural",
                "label": "Municipio propriedade rural",
                "wide": false
            },
            {
                "name": "uf_propriedade_rural",
                "label": "UF propriedade rural",
                "wide": false
            },
            {
                "name": "atividades_desempenhadas",
                "label": "Atividades desempenhadas",
                "wide": true
            },
            {
                "name": "condicao_trabalho_rural",
                "label": "Condicao trabalho rural",
                "wide": false
            },
            {
                "name": "frequencia_trabalho_rural",
                "label": "Frequencia trabalho rural",
                "wide": false
            },
            {
                "name": "nome_responsavel_propriedade",
                "label": "Nome responsavel propriedade",
                "wide": false
            },
            {
                "name": "cpf_responsavel_propriedade",
                "label": "CPF responsavel propriedade",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "ORGao destino",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data assinatura extenso",
                "wide": false
            }
        ]
    }
];

    /* v130: os campos abaixo são a única fonte oficial dos formulários e templates. */
    const DOCSPACE_FIELD_ALIAS_MAP = {
        "profissão_comandatario": "profissao_comandatario",
        "profissão_comodatario": "profissao_comandatario",
        "profissao_comodatario": "profissao_comandatario",
        "município_comandatrio": "municipio_comandatario",
        "municipio_comandatrio": "municipio_comandatario",
        "municipio_comodatario": "municipio_comandatario",
        "endereço_representante": "endereco_representante",
        "duração_contrato": "duracao_contrato",
        "mês": "mes",
        "endereço": "endereco",
        "período_numero": "periodo_numero",
        "período_extenso": "periodo_extenso",
        "área_total_imovel": "area_total_imovel",
        "benefício": "beneficio",
        "órgão_destino": "orgao_destino",
        "função_rural": "funcao_rural",
    };

    function normalizeFieldKey(name) {
        return String(name || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[\s-]+/g, "_");
    }

    const DOCSPACE_FIELD_CANONICAL_BY_NORMALIZED = Object.entries(DOCSPACE_FIELD_ALIAS_MAP).reduce((acc, [original, canonical]) => {
        acc[normalizeFieldKey(original)] = canonical;
        acc[normalizeFieldKey(canonical)] = canonical;
        return acc;
    }, {});

    const DOCSPACE_FIELD_REVERSE_ALIASES = Object.entries(DOCSPACE_FIELD_ALIAS_MAP).reduce((acc, [original, canonical]) => {
        if (!acc[canonical]) acc[canonical] = [];
        acc[canonical].push(original);
        return acc;
    }, {});

    function canonicalFieldName(name) {
        const raw = String(name || "").trim();
        return DOCSPACE_FIELD_ALIAS_MAP[raw] || DOCSPACE_FIELD_CANONICAL_BY_NORMALIZED[normalizeFieldKey(raw)] || raw;
    }

    function normalizeTemplateFieldForUi(field) {
        const name = canonicalFieldName(field?.name);
        return {
            ...field,
            name,
            originalName: field?.name,
            label: field?.label || formatLabel(name),
        };
    }


    const DOC_MAP = new Map(DOCS.map((doc) => [doc.id, doc]));
    const CATEGORIES = [
        { id: "todos", label: "Todos" },
        { id: "contratos", label: "Contratos" },
        { id: "declaracoes", label: "Declarações" },
        { id: "rural", label: "Rural" },
        { id: "procuracoes", label: "Procurações" },
    ];
    const PLAN_OPTIONS = [
        { id: "test3min", label: "3 minutos para teste" },
        { id: "test10c", label: "Teste Mercado Pago - R$ 0,10" },
        { id: "basic30", label: "30 dias plano Básico" },
        { id: "proMax365", label: "365 dias plano Pro Max" },
    ];
    const PAYMENT_PLANS = [
        { id: "basic30", label: "Plano Básico", price: "R$ 79,90" },
        { id: "proMax365", label: "Plano Pro Max", price: "R$ 590,99" },
    ];
    const EXPANDED_CATEGORY_LABELS = {
        "Contratos": ["contratos", "Contratos"],
        "Declarações": ["declaracoes", "Declarações"],
        "Rural": ["rural", "Rural"],
        "Previdenciário": ["previdenciario", "Previdenciário"],
        "Requerimentos e Pedidos": ["requerimentos", "Requerimentos"],
        "Correspondências": ["correspondencias", "Correspondências"],
        "Recibos, Termos e Autorizações": ["recibos-termos", "Recibos e termos"],
        "Procurações": ["procuracoes", "Procurações"],
    };

    function expandedCategoryInfo(value) {
        const raw = String(value || "Outros").trim();
        if (EXPANDED_CATEGORY_LABELS[raw]) return EXPANDED_CATEGORY_LABELS[raw];
        const normalized = normalize(raw);
        if (normalized.includes("procur")) return ["procuracoes", "Procurações"];
        if (normalized.includes("contrat")) return ["contratos", "Contratos"];
        if (normalized.includes("declar")) return ["declaracoes", "Declarações"];
        if (normalized.includes("rural")) return ["rural", "Rural"];
        if (normalized.includes("previd")) return ["previdenciario", "Previdenciário"];
        if (normalized.includes("requer") || normalized.includes("pedido")) return ["requerimentos", "Requerimentos"];
        if (normalized.includes("carta") || normalized.includes("oficio") || normalized.includes("notificacao") || normalized.includes("solicitacao")) return ["correspondencias", "Correspondências"];
        if (normalized.includes("recibo") || normalized.includes("termo") || normalized.includes("autoriz")) return ["recibos-termos", "Recibos e termos"];
        return ["outros", "Outros"];
    }

    async function loadExpandedDocumentCatalog() {
        try {
            const response = await fetch(new URL("modelos/catalogo-integrado.json", document.baseURI), { cache: "no-store" });
            if (!response.ok) throw new Error(`Catálogo HTTP ${response.status}`);
            const catalog = await response.json();
            const templates = Array.isArray(catalog?.templates) ? catalog.templates : [];
            const existingPaths = new Set(DOCS.flatMap((doc) => [doc.modelPath, ...Object.values(doc.modelPaths || {})]).filter(Boolean).map((item) => String(item).replace(/^\.\//, "")));
            const existingIds = new Set(DOCS.map((doc) => doc.id));

            for (const template of templates) {
                const modelPath = `modelos/${template.file}`;
                if (!template?.id || !template?.file || existingIds.has(template.id) || existingPaths.has(modelPath)) continue;
                const [category, categoryLabel] = expandedCategoryInfo(template.category);
                const fields = Array.isArray(template.fields) ? template.fields.map((fieldName) => ({
                    name: canonicalFieldName(fieldName),
                    label: formatLabel(canonicalFieldName(fieldName)),
                    wide: isLongField(fieldName, formatLabel(fieldName)),
                })) : [];
                const doc = {
                    id: String(template.id),
                    title: String(template.name || template.id),
                    description: String(template.description || `Modelo profissional da categoria ${categoryLabel}.`),
                    category,
                    modelPath,
                    fileName: `${String(template.id).replace(/_/g, "-")}.docx`,
                    fields,
                    expanded: true,
                    source: template.source || "Biblioteca DocSpace",
                    keywords: Array.isArray(template.keywords) ? template.keywords : [],
                };
                DOCS.push(doc);
                DOC_MAP.set(doc.id, doc);
                existingIds.add(doc.id);
                existingPaths.add(modelPath);
                if (!CATEGORIES.some((item) => item.id === category)) CATEGORIES.push({ id: category, label: categoryLabel });
            }
            DOCS.sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "pt-BR"));
        } catch (error) {
            console.warn("DocSpace: catálogo expandido não pôde ser carregado.", error);
        }
    }
    const PDF_MAX_SERVER_BYTES = 500 * 1024 * 1024;
    const PDF_MAX_LOCAL_BYTES = 500 * 1024 * 1024;
    const PDF_CATEGORIES = [
        { id: "todos", label: "Todas" },
        { id: "otimizar", label: "Otimizar" },
        { id: "organizar", label: "Organizar" },
        { id: "converter", label: "Converter" },
        { id: "marcar", label: "Marcar" },
    ];
    const PDF_TOOL_LUCIDE = {
        compress: "archive-restore", splitSize: "scissors-line-dashed", clean: "eraser", merge: "combine",
        split: "split-square-vertical", extract: "file-output", remove: "file-x-2", organize: "list-ordered",
        reverse: "arrow-down-up", rotate: "rotate-cw", blank: "file-plus-2", duplicate: "copy-plus",
        oddEven: "columns-2", images: "images", wordPdf: "file-type-2", ocr: "scan-text",
        number: "list-ordered", watermark: "droplets", stamp: "stamp", headerFooter: "panel-top-bottom-dashed",
        pdfImages: "image-down", crop: "crop", resizeA4: "scan", metadata: "file-cog",
    };
    const PDF_TOOLS = {
        compress: {
            category: "otimizar", title: "Comprimir PDF", icon: "📦", server: true,
            description: "Reduz o tamanho usando o servidor e, se necessário, um modo local de segurança.",
            accept: ".pdf,application/pdf", pages: "Páginas opcional (ex.: 1,3-5)", compression: true,
            hint: "Use Máxima para arquivos escaneados e Equilibrada para documentos comuns.",
        },
        splitSize: {
            category: "otimizar", title: "Dividir por tamanho", icon: "➗",
            description: "Cria partes com tamanho máximo definido, usando redução de qualidade em páginas isoladas quando necessário.",
            accept: ".pdf,application/pdf", splitSizeOpts: true, multiOutput: true,
            hint: "Ex.: limite de 4,5 MB gera documento_parte_01.pdf, documento_parte_02.pdf…",
        },
        clean: {
            category: "otimizar", title: "Limpar PDF", icon: "🧹",
            description: "Remove metadados, regrava as páginas e elimina objetos não utilizados.",
            accept: ".pdf,application/pdf",
        },
        merge: {
            category: "organizar", title: "Juntar PDFs", icon: "🔗",
            description: "Une vários PDFs em um único arquivo, respeitando a ordem selecionada.",
            accept: ".pdf,application/pdf", multiple: true, hint: "Selecione 2 ou mais arquivos.",
        },
        split: {
            category: "organizar", title: "Dividir por página", icon: "✂️",
            description: "Gera um arquivo por página ou apenas para o intervalo informado.",
            accept: ".pdf,application/pdf", pages: "Páginas opcional: 1,3-5", multiOutput: true,
        },
        extract: {
            category: "organizar", title: "Extrair páginas", icon: "📄",
            description: "Cria um novo PDF somente com as páginas escolhidas.",
            accept: ".pdf,application/pdf", pages: "Extrair: 1,3-5", requiredPages: true,
        },
        remove: {
            category: "organizar", title: "Remover páginas", icon: "🗑️",
            description: "Exclui páginas específicas e mantém o restante do documento.",
            accept: ".pdf,application/pdf", pages: "Remover: 2,4-6", requiredPages: true,
        },
        organize: {
            category: "organizar", title: "Reordenar páginas", icon: "📑",
            description: "Monta o PDF na sequência exata informada.",
            accept: ".pdf,application/pdf", pages: "Nova ordem: 3,1,2,4-6", requiredPages: true,
        },
        reverse: {
            category: "organizar", title: "Inverter ordem", icon: "🔃",
            description: "Transforma a última página na primeira e inverte todo o documento.",
            accept: ".pdf,application/pdf",
        },
        rotate: {
            category: "organizar", title: "Girar páginas", icon: "🔄",
            description: "Gira todas as páginas ou somente as informadas.",
            accept: ".pdf,application/pdf", pages: "Páginas opcional (vazio = todas)", rotation: true,
        },
        blank: {
            category: "organizar", title: "Inserir páginas em branco", icon: "⬜",
            description: "Insere páginas A4 em branco no início, no fim ou depois de uma página.",
            accept: ".pdf,application/pdf", blankPages: true,
        },
        duplicate: {
            category: "organizar", title: "Duplicar páginas", icon: "⧉",
            description: "Duplica páginas informadas ou todo o documento.",
            accept: ".pdf,application/pdf", pages: "Páginas a duplicar (vazio = documento inteiro)",
        },
        oddEven: {
            category: "organizar", title: "Ímpares e pares", icon: "½",
            description: "Extrai páginas ímpares, pares ou gera dois arquivos separados.",
            accept: ".pdf,application/pdf", oddEven: true, multiOutput: true,
        },
        images: {
            category: "converter", title: "Imagens para PDF", icon: "🖼️",
            description: "Transforma JPG e PNG em um PDF único, em A4 ou tamanho original.",
            accept: ".jpg,.jpeg,.png,image/jpeg,image/png", multiple: true, imagesOpts: true,
        },
        wordPdf: {
            category: "converter", title: "Word para PDF", icon: "📝", server: true,
            description: "Converte o DOCX real para PDF preservando tabelas, logos, cabeçalhos e formatação.",
            accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            hint: "A conversão é feita com LibreOffice no servidor, nunca por captura ou extração simples de texto.",
        },
        ocr: {
            category: "converter", title: "OCR pesquisável", icon: "🔍", server: true,
            description: "Transforma PDF digitalizado ou imagem em PDF com camada de texto pesquisável.",
            accept: ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp", multiple: true, ocr: true,
            hint: "Pode demorar em arquivos grandes.",
        },
        number: {
            category: "marcar", title: "Numerar páginas", icon: "🔢",
            description: "Insere numeração profissional no cabeçalho ou rodapé.",
            accept: ".pdf,application/pdf", numberOpts: true,
        },
        watermark: {
            category: "marcar", title: "Marca d'água", icon: "💧",
            description: "Adiciona um texto diagonal em todas as páginas.",
            accept: ".pdf,application/pdf", watermarkOpts: true,
        },
        stamp: {
            category: "marcar", title: "Carimbo de texto", icon: "🏷️",
            description: "Aplica um carimbo em um canto ou no centro das páginas.",
            accept: ".pdf,application/pdf", stampOpts: true,
        },
        headerFooter: {
            category: "marcar", title: "Cabeçalho e rodapé", icon: "📌",
            description: "Insere textos fixos no topo e no rodapé do PDF.",
            accept: ".pdf,application/pdf", headerFooterOpts: true,
        },
        pdfImages: {
            category: "converter", title: "PDF para imagens", icon: "🖼️",
            description: "Converte cada página do PDF em uma imagem PNG ou JPG de alta qualidade.",
            accept: ".pdf,application/pdf", pdfImagesOpts: true, multiOutput: true,
        },
        crop: {
            category: "organizar", title: "Recortar margens", icon: "✂️",
            description: "Aplica uma caixa de recorte uniforme nas páginas selecionadas.",
            accept: ".pdf,application/pdf", pages: "Páginas opcional (vazio = todas)", cropOpts: true,
        },
        resizeA4: {
            category: "organizar", title: "Padronizar em A4", icon: "📐",
            description: "Centraliza e redimensiona todas as páginas para o padrão A4.",
            accept: ".pdf,application/pdf", resizeOpts: true,
        },
        metadata: {
            category: "otimizar", title: "Editar metadados", icon: "🏷️",
            description: "Define título, autor, assunto e palavras-chave do arquivo PDF.",
            accept: ".pdf,application/pdf", metadataOpts: true,
        },
    };
    const AI_HISTORY_STORAGE_KEY = "docspace_ai_history_v143";
    const INITIAL_AI_AREA = localStorage.getItem("docspace_ai_area") === "office" ? "office" : "documents";

    function readAiHistoryStore() {
        try {
            const parsed = JSON.parse(localStorage.getItem(AI_HISTORY_STORAGE_KEY) || "{}");
            return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
        } catch (_) {
            return {};
        }
    }

    function sanitizeAiMessageForStorage(message) {
        const clean = {
            role: message?.role === "assistant" ? "assistant" : "user",
            content: String(message?.content || "").slice(0, 60000),
        };
        if (Array.isArray(message?.attachments) && message.attachments.length) {
            clean.attachments = message.attachments.slice(0, 6).map((item) => ({ name: String(item?.name || "Documento"), type: String(item?.type || "") }));
        }
        ["templateId", "templateDownloadReady", "quotaConsumed"].forEach((key) => {
            if (message?.[key] !== undefined) clean[key] = message[key];
        });
        if (message?.templateData && typeof message.templateData === "object") clean.templateData = message.templateData;
        if (message?.templateOptions && typeof message.templateOptions === "object") clean.templateOptions = message.templateOptions;
        if (Array.isArray(message?.missingFields)) clean.missingFields = message.missingFields;
        return clean;
    }

    function loadAiConversation(area) {
        const store = readAiHistoryStore();
        const messages = Array.isArray(store[area]) ? store[area] : [];
        return messages.slice(-80);
    }

    function loadAiDraft(area) {
        try { return String(localStorage.getItem(`docspace_ai_draft_${area}`) || ""); } catch (_) { return ""; }
    }

    function persistAiDraft(area, value) {
        try { localStorage.setItem(`docspace_ai_draft_${area}`, String(value || "").slice(0, 24000)); } catch (_) {}
    }

    function persistAiConversation() {
        try {
            const area = state.aiArea === "office" ? "office" : "documents";
            const store = readAiHistoryStore();
            store[area] = (state.aiMessages || []).slice(-80).map(sanitizeAiMessageForStorage);
            localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify(store));
            localStorage.setItem("docspace_ai_area", area);
        } catch (error) {
            console.warn("Não foi possível salvar o histórico local da IA.", error);
        }
    }

    function setAiArea(area) {
        const next = area === "office" ? "office" : "documents";
        if (state.aiArea === next) {
            localStorage.setItem("docspace_ai_area", next);
            return;
        }
        persistAiConversation();
        state.aiArea = next;
        state.aiMessages = loadAiConversation(next);
        state.aiAttachments = [];
        state.aiTemplateDialog = null;
        state.aiPendingTemplateRequest = null;
        state.aiAttachMenuOpen = false;
        localStorage.setItem("docspace_ai_area", next);
    }

    const state = {
        view: "dashboard",
        activeArea: localStorage.getItem("docspace_active_area") || "documents",
        category: "todos",
        query: "",
        user: null,
        documentUsage: null,
        pdfToolUsage: null,
        activeDocId: null,
        activePdfTool: "compress",
        pdfCategory: "todos",
        adminUsers: [],
        adminUsersLoading: false,
        adminUsersLoaded: false,
        adminUsersError: "",
        supportMessages: [],
        adminSupportMessages: [],
        adminTab: "users",
        adminUserModalOpen: false,
        adminUserWizardStep: 0,
        adminEditingUserId: "",
        adminHistory: [],
        adminHistoryUser: null,
        adminHistoryLoading: false,
        checkoutPlan: "basic30",
        checkoutPaymentId: sessionStorage.getItem("docspace_checkout_payment_id") || "",
        checkoutTemporaryPassword: sessionStorage.getItem("docspace_checkout_password") || "",
        checkoutPollTimer: null,
        checkoutBrickController: null,
        pdfPreviewUrl: null,
        pdfPreviewFileName: "",
        pdfPreviewBase64: "",
        pdfToolResultUrl: null,
        pdfToolResultBase64: "",
        pdfToolResultFileName: "",
        pdfToolSelectedFiles: [],
        pendingFormData: null,
        pendingFormStep: null,
        templateSettings: {},
        disabledTemplateIds: new Set(),
        commandIndex: 0,
        commandResults: [],
        aiMessages: loadAiConversation(INITIAL_AI_AREA),
        aiAttachments: [],
        aiAttachmentBusy: false,
        aiBusy: false,
        aiBusyStage: "",
        aiMode: "assist",
        aiPendingTemplateRequest: null,
        aiTemplateDialog: null,
        aiArea: INITIAL_AI_AREA,
        aiAttachMenuOpen: false,
        aiDrafts: { documents: loadAiDraft("documents"), office: loadAiDraft("office") },
        aiExportBusy: null,
        aiStatus: null,
        aiStatusChecked: false,
        aiStatusLoading: false,
        aiStatusError: "",
        wordFileName: localStorage.getItem("docspace_word_name") || "Documento",
        wordHtml: localStorage.getItem("docspace_word_draft") || `<h1>Novo documento</h1><p>Comece a escrever aqui. Use a barra de ferramentas acima para formatar o texto, inserir listas, títulos, tabelas, imagens e links.</p><p>Você pode <strong>importar um arquivo .docx</strong> existente ou exportar o resultado em Word ou PDF quando terminar.</p>`,
        excelFileName: "Planilha",
        excelData: loadExcelDraft(),
        excelStyles: {},
        excelSelectedCell: { row: 0, col: 0 },
        excelZoom: 100,
        wordZoom: 100,
        wordSavedAt: "",
        officeAiOpen: false,
        officeAiTarget: "word",
        officeAiBusy: false,
        officeAiPrompt: "",
        officeAiMode: "replace",
        officeAiError: "",
    };

    function loadExcelDraft() {
        try {
            const saved = JSON.parse(localStorage.getItem("docspace_excel_draft") || "null");
            if (Array.isArray(saved) && saved.length && Array.isArray(saved[0])) return saved;
        } catch (_) {}
        return Array.from({ length: 20 }, () => Array.from({ length: 8 }, () => ""));
    }

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const refs = {};

    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        await loadExpandedDocumentCatalog();
        refs.landingView = $("#landingView");
        refs.authView = $("#authView");
        refs.checkoutView = $("#checkoutView");
        refs.appView = $("#appView");
        refs.content = $("#content");
        refs.loginForm = $("#loginForm");
        refs.loginEmail = $("#loginEmail");
        refs.loginPassword = $("#loginPassword");
        refs.loginButton = $("#loginButton");
        refs.loginMessage = $("#loginMessage");
        refs.pageTitle = $("#pageTitle");
        refs.pageKicker = $("#pageKicker");
        refs.pageDescription = $("#pageDescription");
        refs.pageActions = $("#pageActions");
        refs.headerStatusText = $("#headerStatusText");
        refs.headerPlanText = $("#headerPlanText");
        refs.userName = $("#userName");
        refs.userEmail = $("#userEmail");
        refs.userInitials = $("#userInitials");
        refs.adminNavButton = $("#adminNavButton");
        refs.profileButton = $("#profileButton");
        refs.toast = $("#toast");

        if (!refs.landingView || !refs.authView || !refs.appView || !refs.content || !refs.loginForm) {
            console.error("DocSpace: markup essencial não encontrado. Verifique index.html.");
            return;
        }

        refs.landingView.addEventListener("click", (event) => {
            const buy = event.target.closest("[data-buy-plan]");
            if (buy) {
                event.preventDefault();
                openPublicCheckout(buy.dataset.buyPlan);
                return;
            }
            const login = event.target.closest("[data-public-login]");
            if (!login) return;
            event.preventDefault();
            showAuth();
        });
        refs.checkoutView?.addEventListener("click", (event) => {
            if (event.target.closest("[data-checkout-close]")) {
                event.preventDefault();
                stopCheckoutPolling();
                destroyCheckoutBrick();
                showLanding();
                return;
            }
            const copy = event.target.closest("[data-copy-pix]");
            if (copy) copyCheckoutPix(copy.dataset.copyPix || "");
            const verify = event.target.closest("[data-checkout-verify]");
            if (verify) verifyCheckoutPayment();
            const enter = event.target.closest("[data-checkout-enter]");
            if (enter) enterPurchasedAccount();
            const edit = event.target.closest("[data-checkout-edit]");
            if (edit) {
                event.preventDefault();
                showCheckoutFormStage();
            }
            const external = event.target.closest("[data-checkout-external]");
            if (external) sessionStorage.setItem("docspace_checkout_return", "1");
        });
        $("#publicCheckoutForm")?.addEventListener("submit", submitPublicCheckout);
        $("#publicCheckoutForm")?.addEventListener("change", (event) => {
            if (event.target.name === "paymentMethod") {
                $$(".checkout-method", refs.checkoutView).forEach((card) => card.classList.toggle("is-selected", card.contains(event.target)));
                updateCheckoutMethodUi(event.target.value);
            }
        });
        $("#publicCheckoutForm input[name=cpf]")?.addEventListener("input", (event) => {
            event.target.value = maskCpf(event.target.value);
        });
        $$('[data-public-home]').forEach((link) => link.addEventListener("click", (event) => {
            event.preventDefault();
            showLanding();
        }));
        refs.loginForm.addEventListener("submit", handleLogin);
        $("#logoutButton")?.addEventListener("click", logout);
        refs.profileButton?.addEventListener("click", toggleProfileMenu);
        $("#profileMenu")?.addEventListener("click", (event) => {
            const target = event.target.closest("[data-goto]");
            if (!target) return;
            closeProfileMenu();
            navigate(target.dataset.goto);
        });
        $("#togglePassword")?.addEventListener("click", togglePasswordVisibility);
        $("#commandButton")?.addEventListener("click", openCommandPalette);
        $("#commandSearch")?.addEventListener("input", renderCommandResults);
        $("#commandResults")?.addEventListener("click", handleCommandResultClick);
        $("#commandPalette")?.addEventListener("click", (event) => {
            if (event.target.closest("[data-command-close]")) closeCommandPalette();
        });
        refs.pageActions?.addEventListener("click", (event) => {
            const officeAi = event.target.closest("[data-office-ai-open]");
            if (officeAi) {
                launchOfficeAi(officeAi.dataset.officeAiOpen);
                return;
            }
            const target = event.target.closest("[data-goto]");
            if (!target) return;
            if (target.dataset.aiArea) setAiArea(target.dataset.aiArea);
            if (target.dataset.pdfOpenTool) state.activePdfTool = target.dataset.pdfOpenTool;
            navigate(target.dataset.goto);
        });
        $$(".topbar-brand").forEach((brand) => brand.addEventListener("click", (event) => {
            event.preventDefault();
            navigate("dashboard");
        }));
        const setSidebarOpen = (open) => {
            $("#appSidebar")?.classList.toggle("is-open", Boolean(open));
            $("#mobileSidebarBackdrop")?.classList.toggle("is-hidden", !open);
            $("#navToggle")?.setAttribute("aria-expanded", open ? "true" : "false");
        };
        $("#navToggle")?.addEventListener("click", () => setSidebarOpen(!$("#appSidebar")?.classList.contains("is-open")));
        $("#sidebarClose")?.addEventListener("click", () => setSidebarOpen(false));
        $("#mobileSidebarBackdrop")?.addEventListener("click", () => setSidebarOpen(false));
        const handleChromeNavigation = (event) => {
            const button = event.target.closest("[data-view], [data-office-ai-open]");
            if (!button) return;
            if (button.matches("[data-office-ai-open]")) {
                setSidebarOpen(false);
                launchOfficeAi(button.dataset.officeAiOpen);
                return;
            }
            if (button.dataset.view === "ai") {
                const inferredArea = button.dataset.aiArea || (button.closest(".sidebar-group-office") ? "office" : "documents");
                if (inferredArea === "office") {
                    setSidebarOpen(false);
                    launchOfficeAi(state.view === "excel" ? "excel" : "word");
                    return;
                }
                setAiArea(inferredArea);
            }
            if (button.dataset.pdfOpenTool) state.activePdfTool = button.dataset.pdfOpenTool;
            setSidebarOpen(false);
            navigate(button.dataset.view);
        };
        $("#mainNav")?.addEventListener("click", handleChromeNavigation);
        $("#areaSwitcher")?.addEventListener("click", handleChromeNavigation);
        document.addEventListener("keydown", handleGlobalKeydown);
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".user-menu-wrap")) closeProfileMenu();
            if (state.aiAttachMenuOpen && !event.target.closest(".ai-attach-menu-wrap")) {
                state.aiAttachMenuOpen = false;
                $(".ai-attach-menu")?.classList.add("is-hidden");
                $("[data-ai-menu-toggle]")?.setAttribute("aria-expanded", "false");
            }
        });
        refs.content.addEventListener("click", handleContentClick);
        refs.content.addEventListener("submit", handleContentSubmit);
        refs.content.addEventListener("input", handleContentInput);
        refs.content.addEventListener("keydown", handleContentKeydown);
        refs.content.addEventListener("change", handleContentChange);
        refs.content.addEventListener("paste", handleContentPaste);
        refs.content.addEventListener("dragover", handleContentDragOver);
        refs.content.addEventListener("dragleave", handleContentDragLeave);
        refs.content.addEventListener("drop", handleContentDrop);
        refs.content.addEventListener("blur", handleContentBlur, true);

        initIcons();
        removeLegacyServiceWorkers();
        if (!restoreCheckoutAfterRedirect()) checkSession();
    }

    function togglePasswordVisibility() {
        const field = refs.loginPassword;
        const button = $("#togglePassword");
        if (!field || !button) return;
        const showing = field.type === "text";
        field.type = showing ? "password" : "text";
        button.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
        button.innerHTML = `<i data-lucide="${showing ? "eye" : "eye-off"}"></i>`;
        initIcons();
        field.focus();
    }

    function toggleProfileMenu(event) {
        event?.stopPropagation?.();
        const menu = $("#profileMenu");
        if (!menu) return;
        const opening = menu.classList.contains("is-hidden");
        menu.classList.toggle("is-hidden", !opening);
        refs.profileButton?.setAttribute("aria-expanded", opening ? "true" : "false");
    }

    function closeProfileMenu() {
        $("#profileMenu")?.classList.add("is-hidden");
        refs.profileButton?.setAttribute("aria-expanded", "false");
    }

    function handleGlobalKeydown(event) {
        const commandOpen = !$("#commandPalette")?.classList.contains("is-hidden");
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            commandOpen ? closeCommandPalette() : openCommandPalette();
            return;
        }
        if (commandOpen) {
            if (event.key === "Escape") { closeCommandPalette(); return; }
            if (["ArrowDown", "ArrowUp"].includes(event.key)) {
                event.preventDefault();
                const step = event.key === "ArrowDown" ? 1 : -1;
                const total = state.commandResults.length;
                if (total) state.commandIndex = (state.commandIndex + step + total) % total;
                paintCommandSelection();
                return;
            }
            if (event.key === "Enter" && state.commandResults[state.commandIndex]) {
                event.preventDefault();
                runCommand(state.commandResults[state.commandIndex]);
                return;
            }
        }
        if (event.key === "Escape" && state.activeDocId) closeActiveDocument();
        else if (event.key === "Escape") closeProfileMenu();
    }

    function openCommandPalette() {
        if (!state.user) return;
        closeProfileMenu();
        const palette = $("#commandPalette");
        const input = $("#commandSearch");
        palette?.classList.remove("is-hidden");
        document.body.classList.add("modal-open");
        if (input) input.value = "";
        state.commandIndex = 0;
        renderCommandResults();
        setTimeout(() => input?.focus(), 0);
    }

    function closeCommandPalette() {
        $("#commandPalette")?.classList.add("is-hidden");
        if (!state.activeDocId) document.body.classList.remove("modal-open");
    }

    function buildCommandItems() {
        const areas = [
            { type: "view", id: "dashboard", label: "Início", description: "Abrir o painel principal", icon: "layout-dashboard", group: "Área" },
            { type: "view", id: "documents", label: "Documentos", description: "Abrir a biblioteca de modelos", icon: "files", group: "Área" },
            { type: "view", id: "word", label: "Editor Word", description: "Criar, importar e exportar documentos Word", icon: "file-edit", group: "Área" },
            { type: "view", id: "excel", label: "Editor Excel", description: "Criar, importar e exportar planilhas", icon: "file-spreadsheet", group: "Área" },
            { type: "view", id: "ai", label: "Assistente IA", description: "Criar documentos e conteúdos para Word ou PDF", icon: "sparkles", group: "Área" },
            { type: "view", id: "pdf", label: "Ferramentas PDF", description: "Abrir a central de PDF", icon: "file-cog", group: "Área" },
            { type: "view", id: "support", label: "Atendimento", description: "Abrir suporte e mensagens", icon: "messages-square", group: "Área" },
            { type: "view", id: "profile", label: "Minha conta", description: "Ver plano, vencimento e acesso", icon: "circle-user-round", group: "Área" },
        ];
        if (isAdmin()) areas.push({ type: "view", id: "admin", label: "Administração", description: "Gerenciar usuários e permissões", icon: "shield", group: "Área" });
        const documents = DOCS.filter((doc) => !state.disabledTemplateIds?.has?.(doc.id) && doc.isActive !== false).map((doc) => ({
            type: "document", id: doc.id, label: doc.title, description: doc.description || categoryLabel(doc.category), icon: "file-text", group: "Documento",
        }));
        const tools = Object.entries(PDF_TOOLS).map(([id, tool]) => ({
            type: "pdf", id, label: tool.title, description: tool.description, icon: PDF_TOOL_LUCIDE[id] || "file-cog", group: "PDF",
        }));
        return [...areas, ...documents, ...tools];
    }

    function renderCommandResults() {
        const container = $("#commandResults");
        if (!container) return;
        const query = normalize($("#commandSearch")?.value || "");
        state.commandResults = buildCommandItems().filter((item) => {
            if (!query) return item.type === "view" || item.type === "document" && DOCS.findIndex((doc) => doc.id === item.id) < 4;
            return normalize(`${item.label} ${item.description} ${item.group}`).includes(query);
        }).slice(0, 12);
        state.commandIndex = Math.min(state.commandIndex, Math.max(0, state.commandResults.length - 1));
        container.innerHTML = state.commandResults.length ? state.commandResults.map((item, index) => `
            <button type="button" class="command-result ${index === state.commandIndex ? "is-selected" : ""}" data-command-index="${index}">
                <span class="command-result-icon"><i data-lucide="${escapeAttr(item.icon)}"></i></span>
                <span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.description)}</small></span>
                <span>${escapeHtml(item.group)}</span>
            </button>`).join("") : `<div class="command-empty">Nenhum resultado encontrado.</div>`;
        initIcons();
    }

    function paintCommandSelection() {
        $$("[data-command-index]", $("#commandResults")).forEach((node, index) => node.classList.toggle("is-selected", index === state.commandIndex));
        $(`[data-command-index="${state.commandIndex}"]`, $("#commandResults"))?.scrollIntoView({ block: "nearest" });
    }

    function handleCommandResultClick(event) {
        const button = event.target.closest("[data-command-index]");
        if (!button) return;
        const item = state.commandResults[Number(button.dataset.commandIndex)];
        if (item) runCommand(item);
    }

    function runCommand(item) {
        closeCommandPalette();
        if (item.type === "view") { navigate(item.id); return; }
        if (item.type === "document") {
            state.view = "documents";
            state.activeDocId = item.id;
            $$("#mainNav [data-view]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.view === "documents"));
            render();
            return;
        }
        if (item.type === "pdf") {
            state.activePdfTool = item.id;
            state.pdfCategory = "todos";
            navigate("pdf");
        }
    }

    async function removeLegacyServiceWorkers() {
        // O frontend oficial não registra Service Worker neste momento.
        // Isso evita que um deploy antigo continue servindo HTML/CSS/JS em cache.
        try {
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map((registration) => registration.unregister()));
            }
            if ("caches" in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
            }
        } catch (error) {
            console.warn("Não foi possível limpar caches antigos", error);
        }
    }

    async function checkSession() {
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        if (!token) {
            if (window.location.hash === "#login") showAuth();
            else showLanding();
            return;
        }
        try {
            const data = await apiRequest("/api/session");
            applySession(data);
            showApp();
            render();
        } catch (error) {
            localStorage.removeItem(SESSION_TOKEN_KEY);
            showAuth(error.message || "Sessão expirada. Entre novamente.");
        }
    }

    async function handleLogin(event) {
        event.preventDefault();
        setLoginLoading(true);
        refs.loginMessage.textContent = "";
        refs.loginMessage.className = "message";

        const email = String(refs.loginEmail?.value || "").trim().toLowerCase();
        const password = String(refs.loginPassword?.value || "");

        if (!email || !password) {
            refs.loginMessage.textContent = "Informe e-mail e senha.";
            refs.loginMessage.className = "message error";
            setLoginLoading(false);
            return;
        }

        if (!API_BASE_URL) {
            refs.loginMessage.textContent = "API não configurada (app-config.js). Contate o suporte.";
            refs.loginMessage.className = "message error";
            setLoginLoading(false);
            return;
        }

        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: { email, password },
                allowBillingToken: true,
            });

            if (!data?.sessionToken && !data?.user) {
                throw new Error("Resposta de login inválida da API.");
            }

            applySession(data);
            showApp();
            navigate("dashboard");
            toast(data.message || "Login realizado com sucesso.", "success");
        } catch (error) {
            if (error.data?.billingToken || error.status === 403) {
                if (error.data?.billingToken) {
                    localStorage.setItem(BILLING_TOKEN_KEY, error.data.billingToken);
                }
                state.user = error.data?.user || null;
                if (state.user) {
                    showApp();
                    navigate("profile");
                }
                toast(error.message || "Acesso bloqueado. Regularize o plano.", "error");
                refs.loginMessage.textContent = error.message || "Acesso bloqueado por pagamento/plano.";
                refs.loginMessage.className = "message error";
                return;
            }

            let message = translateError(error);
            if (error.status === 401) {
                message = "E-mail ou senha incorretos. Confira os dados informados e tente novamente.";
            } else if (/Failed to fetch|NetworkError|Load failed/i.test(String(error.message || ""))) {
                message = "Não foi possível conectar na API. Verifique internet e app-config.js.";
            }

            refs.loginMessage.textContent = message;
            refs.loginMessage.className = "message error";
            console.error("Login falhou:", error);
        } finally {
            setLoginLoading(false);
        }
    }

    async function logout() {
        try { await apiRequest("/api/auth/logout", { method: "POST" }); } catch (_) {}
        localStorage.removeItem(SESSION_TOKEN_KEY);
        localStorage.removeItem(BILLING_TOKEN_KEY);
        persistAiConversation();
        state.user = null;
        state.activeDocId = null;
        state.aiMessages = loadAiConversation(state.aiArea);
        state.aiAttachments = [];
        state.aiTemplateDialog = null;
        state.aiPendingTemplateRequest = null;
        document.body.classList.remove("modal-open");
        showLanding();
    }

    function applySession(data) {
        if (data.sessionToken) localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
        state.user = data.user || state.user;
        state.documentUsage = data.documentUsage || state.documentUsage;
        state.pdfToolUsage = data.pdfToolUsage || state.pdfToolUsage;
        updateUserChrome();
        window.DocSpaceProduct?.onSessionReady?.().catch?.((error) => {
            console.warn("Catálogo de modelos não carregado:", error);
        });
    }

    function showLanding() {
        closeProfileMenu();
        closeCommandPalette();
        document.body.dataset.view = "landing";
        document.body.dataset.area = "hub";
        refs.landingView.classList.remove("is-hidden");
        refs.authView.classList.add("is-hidden");
        refs.checkoutView?.classList.add("is-hidden");
        refs.appView.classList.add("is-hidden");
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        window.scrollTo({ top: 0, behavior: "auto" });
        initIcons();
    }

    function showAuth(message = "") {
        closeProfileMenu();
        closeCommandPalette();
        document.body.dataset.view = "login";
        document.body.dataset.area = "hub";
        refs.landingView.classList.add("is-hidden");
        refs.authView.classList.remove("is-hidden");
        refs.checkoutView?.classList.add("is-hidden");
        refs.appView.classList.add("is-hidden");
        refs.loginMessage.textContent = message || "";
        refs.loginMessage.className = message ? "message error" : "message";
        history.replaceState(null, "", "#login");
        setTimeout(() => refs.loginEmail?.focus(), 0);
        initIcons();
    }

    function showApp() {
        refs.landingView.classList.add("is-hidden");
        refs.authView.classList.add("is-hidden");
        refs.checkoutView?.classList.add("is-hidden");
        refs.appView.classList.remove("is-hidden");
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        updateUserChrome();
    }


    const PUBLIC_CHECKOUT_PLANS = {
        basic30: { id: "basic30", title: "Plano mensal", description: "Acesso ao DocSpace por 30 dias.", price: "R$ 79,90", amount: 79.90, cycle: "/30 dias" },
        proMax365: { id: "proMax365", title: "Plano anual", description: "Acesso ao DocSpace por 365 dias com melhor custo-benefício.", price: "R$ 590,99", amount: 590.99, cycle: "/365 dias" },
    };

    function maskCpf(value) {
        const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
        return digits.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    const CHECKOUT_METHOD_META = {
        card: {
            button: "Continuar com cartão",
            hint: "Os dados do cartão são protegidos e tokenizados pelo Mercado Pago.",
        },
        pix: {
            button: "Gerar Pix",
            hint: "O QR Code Pix será gerado na hora e o acesso será liberado após a confirmação.",
        },
        boleto: {
            button: "Gerar boleto",
            hint: "O boleto será emitido pelo Mercado Pago e o acesso será liberado após a compensação.",
        },
    };

    function updateCheckoutMethodUi(method = "card") {
        const selected = CHECKOUT_METHOD_META[method] || CHECKOUT_METHOD_META.card;
        const hint = $("#checkoutMethodHint span");
        const label = $("#checkoutSubmit span");
        if (hint) hint.textContent = selected.hint;
        if (label && !$("#checkoutSubmit")?.disabled) label.textContent = selected.button;
    }

    async function refreshCheckoutIntegrationStatus() {
        const badge = $("#checkoutIntegrationBadge");
        if (!badge) return;
        badge.classList.remove("is-ready", "is-warning");
        badge.innerHTML = `<i data-lucide="loader-circle"></i> Verificando Mercado Pago`;
        initIcons();
        try {
            const data = await apiRequest("/api/public/checkout/config");
            if (data?.embeddedCheckout) {
                badge.classList.add("is-ready");
                badge.innerHTML = `<i data-lucide="shield-check"></i> Mercado Pago pronto`;
            } else if (data?.credentialModeMatch === false) {
                badge.classList.add("is-warning");
                badge.innerHTML = `<i data-lucide="triangle-alert"></i> Credenciais incompatíveis`;
            } else if (data?.pixEnabled) {
                badge.classList.add("is-warning");
                badge.innerHTML = `<i data-lucide="triangle-alert"></i> Pix ativo · cartão pendente`;
            } else {
                badge.classList.add("is-warning");
                badge.innerHTML = `<i data-lucide="triangle-alert"></i> Configuração pendente`;
            }
        } catch (_) {
            badge.classList.add("is-warning");
            badge.innerHTML = `<i data-lucide="wifi-off"></i> API indisponível`;
        }
        initIcons();
    }

    function showCheckoutFormStage(options = {}) {
        destroyCheckoutBrick();
        $("#checkoutFormStage")?.classList.remove("is-hidden");
        $("#checkoutResultStage")?.classList.add("is-hidden");
        $("#checkoutPurchaseBox")?.classList.remove("is-hidden");
        if (!options.keepMessage) setMessage($("#checkoutMessage"), "", "");
        const method = $("#publicCheckoutForm input[name=paymentMethod]:checked")?.value || "card";
        updateCheckoutMethodUi(method);
        initIcons();
    }

    function showCheckoutResultStage() {
        $("#checkoutFormStage")?.classList.add("is-hidden");
        $("#checkoutResultStage")?.classList.remove("is-hidden");
        $("#checkoutPurchaseBox")?.classList.add("is-hidden");
    }

    function ensureMercadoPagoSdk(timeoutMs = 12000) {
        if (window.MercadoPago) return Promise.resolve(true);
        return new Promise((resolve) => {
            const existing = document.querySelector('script[src*="sdk.mercadopago.com/js/v2"]');
            if (existing) existing.remove();
            const script = document.createElement("script");
            let settled = false;
            const finish = (value) => {
                if (settled) return;
                settled = true;
                window.clearTimeout(timer);
                resolve(Boolean(value && window.MercadoPago));
            };
            script.src = `https://sdk.mercadopago.com/js/v2?docspace=${Date.now()}`;
            script.async = true;
            script.dataset.docspaceMercadoPagoSdk = "1";
            script.onload = () => finish(true);
            script.onerror = () => finish(false);
            const timer = window.setTimeout(() => finish(false), timeoutMs);
            document.head.appendChild(script);
        });
    }

    function renderCheckoutConfigurationError(stage, missing, fallbackUrl = "") {
        const details = missing.length ? missing.join(", ") : "integração indisponível";
        stage.innerHTML = `<div class="checkout-result checkout-brick-result">
            <span class="checkout-result-icon"><i data-lucide="triangle-alert"></i></span>
            <p class="checkout-kicker">Configuração necessária</p>
            <h2>Não foi possível abrir o pagamento incorporado</h2>
            <p>O checkout foi interrompido antes de solicitar qualquer dado do cartão.</p>
            <div class="checkout-config-error"><strong>Verifique no Worker:</strong><span>${escapeHtml(details)}.</span><span>Depois de corrigir, publique novamente o Worker e tente outra vez.</span></div>
            ${fallbackUrl ? `<a class="checkout-mp-fallback" href="${escapeAttr(fallbackUrl)}" target="_blank" rel="noopener" data-checkout-external>Abrir pagamento no Mercado Pago</a>` : ""}
            <button type="button" class="checkout-back-inline" data-checkout-edit>Voltar aos dados</button>
        </div>`;
        initIcons();
    }

    function openPublicCheckout(planId = "basic30") {
        destroyCheckoutBrick();
        const plan = PUBLIC_CHECKOUT_PLANS[planId] || PUBLIC_CHECKOUT_PLANS.basic30;
        state.checkoutPlan = plan.id;
        document.body.dataset.view = "checkout";
        document.body.dataset.area = "hub";
        refs.landingView.classList.add("is-hidden");
        refs.authView.classList.add("is-hidden");
        refs.appView.classList.add("is-hidden");
        refs.checkoutView?.classList.remove("is-hidden");
        const form = $("#publicCheckoutForm");
        form?.reset();
        $("#checkoutPlan").value = plan.id;
        $("#checkoutPlanTitle").textContent = plan.title;
        $("#checkoutPlanDescription").textContent = plan.description;
        $("#checkoutPlanPrice").textContent = plan.price;
        $("#checkoutSubtotalPrice") && ($("#checkoutSubtotalPrice").textContent = plan.price);
        $("#checkoutPlanCycle").textContent = plan.id === "proMax365" ? "Vigência de 365 dias" : "Vigência de 30 dias";
        $$(".checkout-method", refs.checkoutView).forEach((card) => {
            const radio = card.querySelector('input[name="paymentMethod"]');
            card.classList.toggle("is-selected", radio?.value === "card");
        });
        showCheckoutFormStage();
        refreshCheckoutIntegrationStatus();
        history.replaceState(null, "", "#comprar");
        window.scrollTo({ top: 0, behavior: "auto" });
        initIcons();
    }

    async function submitPublicCheckout(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const fd = new FormData(form);
        const message = $("#checkoutMessage");
        const submit = $("#checkoutSubmit");
        const name = String(fd.get("name") || "").trim();
        const email = String(fd.get("email") || "").trim().toLowerCase();
        const cpf = String(fd.get("cpf") || "").replace(/\D/g, "");
        const plan = String(fd.get("plan") || state.checkoutPlan || "basic30");
        const paymentMethod = String(fd.get("paymentMethod") || "card");
        if (name.split(/\s+/).filter(Boolean).length < 2) return setMessage(message, "Informe o nome completo.", "error");
        if (!/^\S+@\S+\.\S+$/.test(email)) return setMessage(message, "Informe um e-mail válido.", "error");
        if (!isValidCpf(cpf)) return setMessage(message, "Informe um CPF válido.", "error");
        if (!fd.get("terms")) return setMessage(message, "Confirme os dados e os termos para continuar.", "error");
        submit.disabled = true;
        submit.querySelector("span").textContent = "Preparando pagamento...";
        setMessage(message, "Criando seu acesso e conectando ao Mercado Pago...", "");
        try {
            const started = await apiRequest("/api/public/checkout/start", { method: "POST", body: { name, email, cpf, plan } });
            if (!started?.billingToken) throw new Error("O servidor não retornou a autorização de pagamento.");
            localStorage.setItem(BILLING_TOKEN_KEY, started.billingToken);
            if (started.temporaryPassword) {
                state.checkoutTemporaryPassword = started.temporaryPassword;
                sessionStorage.setItem("docspace_checkout_password", started.temporaryPassword);
            }
            sessionStorage.setItem("docspace_checkout_email", email);
            sessionStorage.setItem("docspace_checkout_plan", plan);
            const payment = paymentMethod === "pix"
                ? await apiRequest("/api/billing/pix", { method: "POST", body: { plan, mode: started.existingUser ? "renew" : "change" } })
                : await apiRequest("/api/billing/checkout", { method: "POST", body: { plan, mode: started.existingUser ? "renew" : "change", preferredPaymentMethod: paymentMethod } });
            const paymentId = payment?.payment?.id;
            if (!paymentId) throw new Error(payment?.message || "O pagamento foi criado sem identificador.");
            state.checkoutPaymentId = paymentId;
            sessionStorage.setItem("docspace_checkout_payment_id", paymentId);
            setMessage(message, "", "");
            if (paymentMethod === "pix") {
                renderPublicPix(payment, { email, cpf, name, temporaryPassword: started.temporaryPassword || "" });
                startCheckoutPolling();
            } else {
                await renderPublicPaymentBrick(payment, { email, cpf, name, temporaryPassword: started.temporaryPassword || "" }, paymentMethod);
            }
        } catch (error) {
            showCheckoutFormStage({ keepMessage: true });
            setMessage(message, translateError(error), "error");
        } finally {
            submit.disabled = false;
            updateCheckoutMethodUi(paymentMethod);
        }
    }

    async function destroyCheckoutBrick() {
        const controller = state.checkoutBrickController;
        state.checkoutBrickController = null;
        if (!controller?.unmount) return;
        try { await controller.unmount(); } catch (_) {}
    }

    async function renderPublicPaymentBrick(data, identity = {}, preferredMethod = "card") {
        await destroyCheckoutBrick();
        const stage = $("#checkoutResultStage");
        showCheckoutResultStage();
        if (!stage) return;
        const isBoleto = preferredMethod === "boleto";
        const fallbackUrl = String(data?.checkoutUrl || "");
        stage.innerHTML = `<div class="checkout-result checkout-brick-result">
            <span class="checkout-result-icon"><i data-lucide="${isBoleto ? "barcode" : "credit-card"}"></i></span>
            <p class="checkout-kicker">${isBoleto ? "Pagamento por boleto" : "Pagamento por cartão"}</p>
            <h2>${isBoleto ? "Emita o seu boleto" : "Finalize com segurança"}</h2>
            <p>${isBoleto ? "Preencha os dados solicitados para gerar o boleto." : "O formulário seguro abaixo é fornecido pelo Mercado Pago. O DocSpace não recebe o número completo do cartão."}</p>
            <div id="publicPaymentBrickLoading" class="checkout-brick-loading"><span class="checkout-status-dot"></span> Carregando pagamento seguro...</div>
            <div id="publicPaymentBrick" class="checkout-brick-container"></div>
            <div class="checkout-payment-status is-pending" id="checkoutPaymentStatus"><span class="checkout-status-dot"></span><div><strong>Aguardando conclusão</strong><small>O acesso será liberado após a confirmação.</small></div></div>
            ${identity.temporaryPassword ? `<div class="checkout-credentials-preview"><strong>Acesso reservado</strong><span>E-mail: ${escapeHtml(identity.email)}</span><span>A senha será exibida novamente após a confirmação.</span></div>` : ""}
            <button type="button" class="checkout-back-inline" data-checkout-edit>Voltar e alterar os dados</button>
        </div>`;
        initIcons();

        const sdkReady = await ensureMercadoPagoSdk();
        const missing = [];
        if (!sdkReady || !window.MercadoPago) missing.push("SDK MercadoPago.js não carregou");
        if (!String(data?.publicKey || "").trim()) missing.push("MERCADO_PAGO_PUBLIC_KEY ausente ou incompatível com o Access Token");
        if (!String(data?.preferenceId || "").trim()) missing.push("preferência de pagamento não retornada");
        if (data?.message && /ambientes diferentes/i.test(String(data.message))) missing.push(String(data.message));
        if (missing.length) {
            renderCheckoutConfigurationError(stage, missing, fallbackUrl);
            return;
        }

        const plan = PUBLIC_CHECKOUT_PLANS[state.checkoutPlan] || PUBLIC_CHECKOUT_PLANS.basic30;
        const parts = String(identity.name || "Cliente DocSpace").trim().split(/\s+/).filter(Boolean);
        const firstName = parts.shift() || "Cliente";
        const lastName = parts.join(" ") || "DocSpace";
        try {
            const mercadoPago = new window.MercadoPago(String(data.publicKey).trim(), { locale: "pt-BR" });
            const bricksBuilder = mercadoPago.bricks();
            const paymentMethods = isBoleto
                ? { ticket: "all" }
                : { creditCard: "all", debitCard: "all", prepaidCard: "all" };
            state.checkoutBrickController = await bricksBuilder.create("payment", "publicPaymentBrick", {
                initialization: {
                    amount: Number(plan.amount),
                    preferenceId: String(data.preferenceId),
                    payer: {
                        firstName,
                        lastName,
                        email: String(identity.email || ""),
                        identification: { type: "CPF", number: String(identity.cpf || "").replace(/\D/g, "") },
                    },
                },
                customization: {
                    paymentMethods,
                    visual: {
                        style: {
                            theme: "default",
                            customVariables: {
                                baseColor: "#111111",
                                baseColorFirstVariant: "#272727",
                                baseColorSecondVariant: "#4b4b4b",
                                textPrimaryColor: "#111111",
                                textSecondaryColor: "#6b7280",
                                inputBackgroundColor: "#ffffff",
                                formBackgroundColor: "#ffffff",
                                outlinePrimaryColor: "#dedede",
                                outlineSecondaryColor: "#111111",
                                buttonTextColor: "#ffffff",
                                borderRadiusSmall: "10px",
                                borderRadiusMedium: "13px",
                                borderRadiusLarge: "18px",
                            },
                        },
                    },
                },
                callbacks: {
                    onReady: () => $("#publicPaymentBrickLoading")?.classList.add("is-hidden"),
                    onSubmit: ({ formData }) => new Promise(async (resolve, reject) => {
                        const statusBox = $("#checkoutPaymentStatus");
                        if (statusBox) statusBox.innerHTML = `<span class="checkout-status-dot"></span><div><strong>Processando pagamento...</strong><small>Aguarde a resposta do Mercado Pago.</small></div>`;
                        try {
                            const result = await apiRequest("/api/billing/brick-payment", { method: "POST", body: { paymentId: state.checkoutPaymentId, formData } });
                            if (result?.sessionToken) localStorage.setItem(SESSION_TOKEN_KEY, result.sessionToken);
                            if (result?.user) state.user = result.user;
                            if (result?.payment?.status === "approved") {
                                await destroyCheckoutBrick();
                                renderCheckoutApproved(result);
                            } else if (isBoleto && result?.ticket?.url) {
                                await destroyCheckoutBrick();
                                renderPublicBoletoResult(result, identity);
                                startCheckoutPolling();
                            } else {
                                if (statusBox) statusBox.innerHTML = `<span class="checkout-status-dot"></span><div><strong>Pagamento enviado</strong><small>Aguardando confirmação do Mercado Pago.</small></div>`;
                                startCheckoutPolling();
                            }
                            resolve();
                        } catch (error) {
                            if (statusBox) statusBox.innerHTML = `<span class="checkout-status-dot"></span><div><strong>Pagamento não concluído</strong><small>${escapeHtml(translateError(error))}</small></div>`;
                            reject(error);
                        }
                    }),
                    onError: (error) => {
                        console.error("Mercado Pago Brick:", error);
                        const loading = $("#publicPaymentBrickLoading");
                        if (loading) loading.innerHTML = `<strong>Não foi possível carregar o formulário.</strong> Verifique a Public Key e tente novamente.`;
                    },
                },
            });
        } catch (error) {
            console.error("Falha ao criar Mercado Pago Brick:", error);
            renderCheckoutConfigurationError(stage, [translateError(error)], fallbackUrl);
        }
    }

    function renderPublicBoletoResult(data, identity = {}) {
        const stage = $("#checkoutResultStage");
        const ticketUrl = String(data?.ticket?.url || "");
        const line = String(data?.ticket?.digitableLine || "");
        if (!stage) return;
        showCheckoutResultStage();
        stage.innerHTML = `<div class="checkout-result checkout-ticket-result">
            <span class="checkout-result-icon"><i data-lucide="barcode"></i></span>
            <p class="checkout-kicker">Boleto emitido</p>
            <h2>Seu boleto está pronto</h2>
            <p>Abra ou baixe o boleto e conclua o pagamento. O acesso será liberado após a compensação confirmada pelo Mercado Pago.</p>
            ${line ? `<label class="field wide"><span>Linha digitável</span><textarea readonly rows="3">${escapeHtml(line)}</textarea></label><button type="button" class="secondary-button checkout-copy" data-copy-pix="${escapeAttr(line)}"><i data-lucide="copy"></i> Copiar linha digitável</button>` : ""}
            <a class="checkout-submit checkout-ticket-button" href="${escapeAttr(ticketUrl)}" target="_blank" rel="noopener"><i data-lucide="download"></i> Abrir ou baixar boleto</a>
            <div class="checkout-payment-status is-pending" id="checkoutPaymentStatus"><span class="checkout-status-dot"></span><div><strong>Aguardando pagamento</strong><small>A confirmação pode ocorrer após a compensação bancária.</small></div></div>
            ${identity.temporaryPassword ? `<div class="checkout-credentials-preview"><strong>Acesso reservado</strong><span>E-mail: ${escapeHtml(identity.email)}</span><span>A senha será exibida novamente quando o pagamento for confirmado.</span></div>` : ""}
            <div class="checkout-result-actions"><button type="button" class="checkout-submit" data-checkout-verify>Verificar pagamento</button><button type="button" class="checkout-back-inline" data-checkout-close>Voltar ao site</button></div>
        </div>`;
        initIcons();
    }

    function renderPublicPix(data, identity = {}) {
        const stage = $("#checkoutResultStage");
        const qrCode = data?.pix?.qrCode || "";
        const qrImage = data?.pix?.qrCodeImage || "";
        showCheckoutResultStage();
        if (!stage) return;
        stage.innerHTML = `<div class="checkout-result">
            <span class="checkout-result-icon"><i data-lucide="qr-code"></i></span>
            <p class="checkout-kicker">Pagamento por Pix</p>
            <h2>Escaneie o QR Code</h2>
            <p>Depois do pagamento, a confirmação será consultada automaticamente.</p>
            <div class="checkout-qr">${qrImage ? `<img src="${escapeAttr(qrImage)}" alt="QR Code Pix">` : `<canvas id="publicPixCanvas"></canvas>`}</div>
            <label class="field wide"><span>Pix copia e cola</span><textarea readonly rows="4">${escapeHtml(qrCode)}</textarea></label>
            <button type="button" class="secondary-button checkout-copy" data-copy-pix="${escapeAttr(qrCode)}"><i data-lucide="copy"></i> Copiar código Pix</button>
            <div class="checkout-payment-status is-pending" id="checkoutPaymentStatus"><span class="checkout-status-dot"></span><div><strong>Aguardando pagamento</strong><small>Você pode manter esta tela aberta.</small></div></div>
            ${identity.temporaryPassword ? `<div class="checkout-credentials-preview"><strong>Acesso reservado</strong><span>E-mail: ${escapeHtml(identity.email)}</span><span>A senha será exibida novamente após a confirmação.</span></div>` : ""}
            <div class="checkout-result-actions"><button type="button" class="checkout-submit" data-checkout-verify>Já paguei · verificar agora</button><button type="button" class="checkout-back-inline" data-checkout-close>Cancelar e voltar</button></div>
        </div>`;
        if (!qrImage && qrCode && window.QRCode) window.QRCode.toCanvas($("#publicPixCanvas"), qrCode, { width: 240 });
        initIcons();
    }

    async function copyCheckoutPix(code) {
        if (!code) return;
        try { await navigator.clipboard.writeText(code); toast("Código Pix copiado.", "success"); }
        catch (_) { window.prompt("Copie o código Pix:", code); }
    }

    function startCheckoutPolling() {
        stopCheckoutPolling();
        state.checkoutPollTimer = window.setInterval(() => verifyCheckoutPayment(true), 7000);
    }

    function stopCheckoutPolling() {
        if (state.checkoutPollTimer) window.clearInterval(state.checkoutPollTimer);
        state.checkoutPollTimer = null;
    }

    async function verifyCheckoutPayment(silent = false) {
        const paymentId = state.checkoutPaymentId || sessionStorage.getItem("docspace_checkout_payment_id");
        if (!paymentId) return;
        const statusBox = $("#checkoutPaymentStatus");
        if (statusBox && !silent) statusBox.innerHTML = `<span class="checkout-status-dot"></span><div><strong>Consultando pagamento...</strong><small>Aguarde alguns segundos.</small></div>`;
        try {
            const data = await apiRequest(`/api/billing/payments/${encodeURIComponent(paymentId)}`);
            if (data?.payment?.status === "approved") {
                stopCheckoutPolling();
                if (data.sessionToken) localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
                if (data.user) state.user = data.user;
                renderCheckoutApproved(data);
                return;
            }
            if (statusBox) statusBox.innerHTML = `<span class="checkout-status-dot"></span><div><strong>Pagamento ainda pendente</strong><small>O Mercado Pago ainda não confirmou. Tentaremos novamente.</small></div>`;
        } catch (error) {
            if (!silent && statusBox) statusBox.innerHTML = `<span class="checkout-status-dot"></span><div><strong>Não foi possível consultar</strong><small>${escapeHtml(translateError(error))}</small></div>`;
        }
    }

    function renderCheckoutApproved(data) {
        const stage = $("#checkoutResultStage");
        const email = sessionStorage.getItem("docspace_checkout_email") || data?.user?.email || "";
        const password = state.checkoutTemporaryPassword || sessionStorage.getItem("docspace_checkout_password") || "";
        if (!stage) return;
        showCheckoutResultStage();
        stage.innerHTML = `<div class="checkout-result checkout-approved">
            <span class="checkout-result-icon"><i data-lucide="badge-check"></i></span>
            <p class="checkout-kicker">Tudo certo</p>
            <h2>Pagamento confirmado</h2>
            <p>O plano foi ativado e o seu acesso está pronto.</p>
            <div class="checkout-login-box"><span><small>E-mail</small><strong>${escapeHtml(email)}</strong></span>${password ? `<span><small>Senha provisória</small><strong>${escapeHtml(password)}</strong></span>` : `<span><small>Senha</small><strong>Use a senha já cadastrada</strong></span>`}</div>
            <p class="checkout-email-note"><i data-lucide="mail-check"></i> A confirmação do pagamento foi enviada ao e-mail informado quando o serviço de e-mail estiver configurado.</p>
            <button type="button" class="checkout-submit" data-checkout-enter>Entrar no DocSpace</button>
        </div>`;
        sessionStorage.removeItem("docspace_checkout_return");
        initIcons();
    }

    async function enterPurchasedAccount() {
        stopCheckoutPolling();
        try {
            const data = await apiRequest("/api/session");
            applySession(data);
            showApp();
            navigate("dashboard");
        } catch (_) {
            showAuth("Pagamento confirmado. Entre com o e-mail e a senha exibidos.");
            refs.loginEmail.value = sessionStorage.getItem("docspace_checkout_email") || "";
        }
    }

    function restoreCheckoutAfterRedirect() {
        const params = new URLSearchParams(window.location.search);
        const returned = sessionStorage.getItem("docspace_checkout_return") === "1" || params.has("payment");
        const paymentId = sessionStorage.getItem("docspace_checkout_payment_id");
        if (!returned || !paymentId) return false;
        openPublicCheckout(sessionStorage.getItem("docspace_checkout_plan") || "basic30");
        showCheckoutResultStage();
        const stage = $("#checkoutResultStage");
        if (stage) stage.innerHTML = `<div class="checkout-result"><span class="checkout-result-icon"><i data-lucide="loader-circle"></i></span><h2>Verificando pagamento</h2><p>Aguarde enquanto consultamos a confirmação no Mercado Pago.</p><div class="checkout-payment-status is-pending" id="checkoutPaymentStatus"><span class="checkout-status-dot"></span><div><strong>Consultando...</strong><small>Não feche esta página.</small></div></div></div>`;
        state.checkoutPaymentId = paymentId;
        initIcons();
        verifyCheckoutPayment();
        startCheckoutPolling();
        return true;
    }

    function setLoginLoading(loading) {
        refs.loginButton.disabled = loading;
        const label = refs.loginButton.querySelector("span");
        if (label) label.textContent = loading ? "Entrando..." : "Entrar";
        else refs.loginButton.textContent = loading ? "Entrando..." : "Entrar";
    }

    function updateUserChrome() {
        const user = state.user || {};
        const displayName = user.name || "Usuário";
        const displayEmail = user.email || "";
        const userInitial = initials(displayName || displayEmail || "DS");
        refs.userName.textContent = displayName;
        refs.userEmail.textContent = displayEmail;
        const avatarDataUrl = user.avatarDataUrl || user.avatar_data_url || "";
        refs.userInitials.innerHTML = avatarDataUrl ? `<img src="${escapeAttr(avatarDataUrl)}" alt="Foto de ${escapeAttr(displayName)}">` : escapeHtml(userInitial);
        refs.userInitials.classList.toggle("has-image", Boolean(avatarDataUrl));
        $("#profileMenuName") && ($("#profileMenuName").textContent = displayName);
        $("#profileMenuEmail") && ($("#profileMenuEmail").textContent = displayEmail);
        $("#profileMenuInitials") && ($("#profileMenuInitials").textContent = userInitial);
        refs.adminNavButton.classList.toggle("is-hidden", !isAdmin());
        if (refs.headerPlanText) refs.headerPlanText.textContent = `${displayPlanLabel(user)} · ${accessStatusLabel(user.status)}`;
        if (refs.headerStatusText) refs.headerStatusText.innerHTML = `<i data-lucide="activity"></i> Sistema pronto`;
        initIcons();
    }

    function navigate(view) {
        closeProfileMenu();
        if (view === "admin" && !isAdmin()) return;
        if (["library", "people", "app-update", "billing"].includes(view)) view = "profile";
        if (view === "ai" && !state.aiArea) state.aiArea = state.activeArea === "office" ? "office" : "documents";
        const requestedArea = areaForView(view);
        if (requestedArea) {
            state.activeArea = requestedArea;
            localStorage.setItem("docspace_active_area", requestedArea);
        }
        if (view !== "documents") {
            clearDocumentPdfPreview();
            state.activeDocId = null;
            document.body.classList.remove("modal-open");
        }
        if (view !== "pdf") {
            clearPdfToolResult();
            state.pdfToolSelectedFiles = [];
        }
        state.view = view;
        updateAppChrome();
        render();
    }

    function areaForView(view) {
        if (view === "documents") return "documents";
        if (view === "pdf") return "pdf";
        if (view === "ai") return state.aiArea === "office" ? "office" : "documents";
        if (view === "word" || view === "excel") return "office";
        return "";
    }

    function resolveActiveArea() {
        if (state.view === "dashboard") return "hub";
        return areaForView(state.view) || state.activeArea || "documents";
    }

    function updateAppChrome() {
        const area = resolveActiveArea();
        document.body.dataset.area = area;
        const configs = {
            hub: { label: "Escolha sua área", subtitle: "Documentos · PDF · Office", icon: "layout-dashboard" },
            documents: { label: "Documentos", subtitle: "Documentos", icon: "files" },
            pdf: { label: "Ferramentas PDF", subtitle: "Ferramentas PDF", icon: "file-text" },
            office: { label: "Ferramentas Office", subtitle: "Ferramentas Office", icon: "briefcase-business" },
        };
        const cfg = configs[area] || configs.hub;
        const label = $("#activeAreaLabel");
        const subtitle = $("#sidebarAreaSubtitle");
        const icon = $("#activeAreaIcon");
        if (label) label.textContent = cfg.label;
        if (subtitle) subtitle.textContent = cfg.subtitle;
        if (icon) icon.innerHTML = `<i data-lucide="${cfg.icon}"></i>`;
        $$("#mainNav [data-view]").forEach((btn) => {
            const isAi = btn.dataset.view === "ai";
            const active = btn.dataset.view === state.view && (!isAi || (btn.dataset.aiArea || "documents") === (state.aiArea || "documents"));
            btn.classList.toggle("is-active", active);
        });
        $$("#areaSwitcher [data-area-target]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.areaTarget === area));
        initIcons();
    }

    function closeActiveDocument() {
        if (!state.activeDocId) return;
        clearDocumentPdfPreview();
        state.activeDocId = null;
        document.body.classList.remove("modal-open");
        if (state.view === "documents") renderDocuments();
    }

    function render() {
        const pages = {
            dashboard: { kicker: "Painel", title: "Início", description: "Acesse os principais recursos e acompanhe sua conta.", actions: `<button class="primary-button" data-goto="documents"><i data-lucide="file-plus-2"></i> Novo documento</button>` },
            documents: { kicker: "Modelos", title: "Biblioteca de modelos", description: "Escolha um modelo para começar.", actions: `<button class="secondary-button" data-goto="pdf"><i data-lucide="file-cog"></i> Ferramentas PDF</button>` },
            ai: { kicker: "Inteligência artificial", title: "Assistente IA", description: "Crie, revise e organize textos com a API protegida no servidor.", actions: `<button class="secondary-button" data-goto="documents"><i data-lucide="files"></i> Usar modelos</button>` },
            word: { kicker: "Ferramentas Office", title: "Editor Word", description: "Edite documentos direto no navegador. Importe .docx, formate e exporte em Word ou PDF.", actions: `<button class="secondary-button office-ai-launch-button" data-office-ai-open="word"><i data-lucide="sparkles"></i> Assistente Word</button>` },
            excel: { kicker: "Ferramentas Office", title: "Editor Excel", description: "Crie e edite planilhas no navegador. Importe Excel ou CSV e exporte quando terminar.", actions: `<button class="secondary-button office-ai-launch-button" data-office-ai-open="excel"><i data-lucide="sparkles"></i> Assistente Excel</button>` },
            pdf: { kicker: "Ferramentas", title: "Ferramentas PDF", description: "Processe arquivos PDF diretamente pelo navegador.", actions: `<button class="secondary-button" data-goto="documents"><i data-lucide="files"></i> Documentos</button>` },
            support: { kicker: "Atendimento", title: "Suporte", description: "Envie uma solicitação e acompanhe o atendimento.", actions: "" },
            profile: { kicker: "Minha conta", title: "Perfil", description: "Consulte seu plano, vencimento e limites de utilização.", actions: `<button class="secondary-button" data-goto="support"><i data-lucide="messages-square"></i> Atendimento</button>` },
            admin: { kicker: "Gestão", title: "Painel Administrativo", description: "Gerencie usuários, planos, permissões e o sistema.", actions: "" },
        };
        if (state.view === "ai") {
            pages.ai = state.aiArea === "office"
                ? { kicker: "Ferramentas Office", title: "Assistente Office", description: "Peça textos para Word e arquivos prontos para baixar.", actions: `<button class="secondary-button" data-goto="documents"><i data-lucide="files"></i> Ver modelos</button>` }
                : { kicker: "Documentos", title: "Assistente Documentos", description: "Peça contratos, declarações e procurações prontos para baixar em Word ou PDF.", actions: `<button class="secondary-button" data-goto="documents"><i data-lucide="files"></i> Usar modelos</button>` };
        }
        const page = pages[state.view] || pages.dashboard;
        document.body.dataset.view = state.view;
        updateAppChrome();
        document.body.classList.toggle("modal-open", state.view === "documents" && Boolean(state.activeDocId));
        refs.pageKicker.textContent = page.kicker;
        refs.pageTitle.textContent = page.title;
        if (refs.pageDescription) refs.pageDescription.textContent = page.description;
        if (refs.pageActions) refs.pageActions.innerHTML = page.actions;
        if (state.view === "dashboard") renderDashboard();
        if (state.view === "documents") renderDocuments();
        if (state.view === "word") renderWordEditor();
        if (state.view === "excel") renderExcelEditor();
        if (state.view === "ai") renderAi();
        if (state.view === "pdf") renderPdfTools();
        if (state.view === "support") renderSupport();
        if (state.view === "profile") renderProfile();
        if (state.view === "admin") renderAdmin();
        initIcons();
    }

    function renderDashboard() {
        const user = state.user || {};
        const firstName = String(user.name || "").trim().split(/\s+/)[0];
        const email = user.email || "";
        refs.content.innerHTML = `
            <div class="hub-topbar">
                <a href="#" class="hub-brand" data-goto="dashboard">
                    <span class="brand-symbol brand-symbol-primary"><i data-lucide="file-text"></i></span>
                    <span class="hub-brand-copy"><strong>DocSpace</strong><small>Escolha sua área</small></span>
                </a>
                <div class="hub-user">
                    <span class="hub-user-copy"><small>Conectado como</small><strong>${escapeHtml(email)}</strong></span>
                    <button type="button" class="hub-logout" data-hub-logout><i data-lucide="log-out"></i> Sair</button>
                </div>
            </div>
            <section class="hub-screen">
                <div class="hub-heading">
                    <span class="hub-welcome-pill"><i data-lucide="sparkles"></i> Bem-vindo${firstName ? `, ${escapeHtml(firstName)}` : ""}</span>
                    <h2>O que você quer fazer agora?</h2>
                    <p>Escolha uma das três áreas. Você pode alternar entre elas quando quiser.</p>
                </div>
                <div class="hub-area-grid">
                    <button type="button" class="hub-area-card" data-area-card="documents" data-goto="documents">
                        <span class="hub-area-icon"><i data-lucide="files"></i></span>
                        <span class="hub-area-tag">Contratos · Procurações</span>
                        <h3>Gerar Documentos</h3>
                        <p>Mais de 100 modelos prontos para preencher e baixar em Word.</p>
                        <span class="hub-area-enter">Entrar <i data-lucide="arrow-right"></i></span>
                    </button>
                    <button type="button" class="hub-area-card" data-area-card="pdf" data-goto="pdf">
                        <span class="hub-area-icon"><i data-lucide="file-text"></i></span>
                        <span class="hub-area-tag">100% local · sem IA</span>
                        <h3>Ferramentas PDF</h3>
                        <p>Juntar, dividir, extrair, girar e comprimir PDFs no seu navegador.</p>
                        <span class="hub-area-enter">Entrar <i data-lucide="arrow-right"></i></span>
                    </button>
                    <button type="button" class="hub-area-card" data-area-card="office" data-goto="word">
                        <span class="hub-area-icon"><i data-lucide="briefcase-business"></i></span>
                        <span class="hub-area-tag">Word · Excel · IA</span>
                        <h3>Ferramentas Office</h3>
                        <p>Editor de Word e Excel completos, com assistente de IA integrado.</p>
                        <span class="hub-area-enter">Entrar <i data-lucide="arrow-right"></i></span>
                    </button>
                </div>
            </section>`;
        initIcons();
    }


    function formatAiProvider(value) {
        const provider = String(value || "").toLowerCase();
        if (provider === "openrouter") return "OpenRouter";
        if (provider === "openai") return "OpenAI";
        if (provider === "docspace-server-clock") return "Relógio do servidor";
        return value ? String(value) : "Provedor não informado";
    }

    function formatAiModel(value) {
        const model = String(value || "").trim();
        if (!model) return "Modelo não informado";
        return model.replace(/^openai\//i, "").replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function buildAiHistoryPayload() {
        return (state.aiMessages || [])
            .slice(0, -1)
            .filter((message) => (message.role === "user" || message.role === "assistant") && String(message.content || "").trim())
            .slice(-12)
            .map((message) => ({ role: message.role, content: String(message.content || "").slice(0, 4000) }));
    }

    function renderAi() {
        const messages = state.aiMessages || [];
        const attachments = state.aiAttachments || [];
        const prepared = Boolean(window.DocSpaceAI?.isPrepared);
        const configured = Boolean(window.DocSpaceAI?.isEnabled);
        const enabled = configured && state.aiStatus?.enabled !== false;
        const statusText = state.aiStatusLoading
            ? "Verificando..."
            : state.aiStatusError
                ? "Erro de conexão"
                : state.aiStatusChecked
                    ? enabled ? "IA ativa" : "IA desativada"
                    : configured ? "Verificar conexão" : prepared ? "Aguardando configuração" : "Indisponível";
        refs.content.innerHTML = `
            <section class="panel ai-chat-shell">
                <header class="ai-chat-header">
                    <div class="ai-chat-identity">
                        <span class="ai-intro-icon"><i data-lucide="sparkles"></i></span>
                        <div><h2>${state.aiArea === "office" ? "Assistente Office" : "Assistente Documentos"}</h2><p>${state.aiArea === "office" ? "Converse, peça revisões e crie conteúdo para Word ou Excel." : "Converse naturalmente. A IA identifica o modelo, lê os anexos e pergunta os dados que faltarem."}</p></div>
                    </div>
                    <div class="ai-chat-header-actions">
                        <span class="ai-area-memory"><i data-lucide="history"></i> Histórico local de ${state.aiArea === "office" ? "Office" : "Documentos"}</span>
                        <button type="button" class="status-pill ${enabled && !state.aiStatusError ? "" : "status-warning"}" data-ai-test>${escapeHtml(statusText)}</button>
                        <button type="button" class="ghost-button ai-clear-chat" data-ai-clear ${messages.length || attachments.length ? "" : "disabled"} aria-label="Limpar conversa"><i data-lucide="trash-2"></i></button>
                    </div>
                </header>

                <div id="aiMessageList" class="ai-message-list ai-chat-message-list" aria-live="polite">
                    ${messages.length ? messages.map((message, index) => renderAiMessage(message, index)).join("") : `
                        <div class="ai-empty-state ai-chat-welcome">
                            <span class="ai-welcome-orb"><i data-lucide="message-circle-more"></i></span>
                            <h3>Como posso ajudar?</h3>
                            <p>${state.aiArea === "office" ? "Escreva o que deseja criar ou revisar." : "Peça o documento pelo nome. Para usar RG, CPF ou comprovantes, clique no botão + e anexe as imagens."}</p>
                            <div class="ai-suggestion-grid">
                                <button type="button" data-ai-example="Gere o contrato de comodato rural usando os documentos que vou anexar.">Contrato de comodato</button>
                                <button type="button" data-ai-example="Preencha a declaração de residência do sistema com os dados dos anexos.">Declaração de residência</button>
                                <button type="button" data-ai-example="Leia os documentos anexados, confira os dados e diga o que ainda falta.">Conferir documentos</button>
                            </div>
                        </div>`}
                    ${state.aiBusy ? renderAiThinking() : ""}
                </div>

                ${state.aiStatusError ? `<p class="message error ai-connection-error"><strong>Conexão com a IA:</strong> ${escapeHtml(state.aiStatusError)}</p>` : ""}
                <form id="aiForm" class="ai-chat-composer" novalidate>
                    <input id="aiAttachmentInput" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple hidden>
                    ${renderAiAttachmentList(attachments)}
                    <div class="ai-chat-input-shell ${state.aiAttachmentBusy ? "is-loading" : ""}">
                        <div class="ai-attach-menu-wrap">
                            <button type="button" class="ai-plus-button" data-ai-menu-toggle aria-label="Adicionar anexo" aria-expanded="${state.aiAttachMenuOpen ? "true" : "false"}"><i data-lucide="plus"></i></button>
                            <div class="ai-attach-menu ${state.aiAttachMenuOpen ? "" : "is-hidden"}">
                                <button type="button" data-ai-attach><span><i data-lucide="image-plus"></i></span><span><strong>Anexar documento</strong><small>RG, CPF, imagem ou PDF</small></span></button>
                            </div>
                        </div>
                        <textarea id="aiPrompt" name="prompt" rows="1" maxlength="24000" placeholder="Mensagem para o Assistente DocSpace" aria-label="Mensagem para a IA">${escapeHtml(state.aiDrafts?.[state.aiArea] || "")}</textarea>
                        <button class="ai-send-button" type="submit" ${state.aiBusy || state.aiAttachmentBusy || (state.aiStatusChecked && !enabled) || !configured ? "disabled" : ""} aria-label="Enviar mensagem">
                            <i data-lucide="${state.aiBusy ? "loader-circle" : "arrow-up"}"></i>
                        </button>
                    </div>
                    <div class="ai-chat-composer-meta">
                        ${attachments.length ? `<label class="ai-document-consent"><input type="checkbox" name="documentConsent" checked required> <span>Autorizo o processamento temporário dos anexos para esta solicitação.</span></label>` : `<span><i data-lucide="paperclip"></i> Clique em + para anexar documentos</span>`}
                        <small>${state.aiBusy ? escapeHtml(state.aiBusyStage || "Processando...") : "Enter envia · Shift+Enter quebra a linha"}</small>
                    </div>
                    <p id="aiMessage" class="message" aria-live="polite"></p>
                </form>
            </section>
            ${renderAiTemplateDialog()}`;
        initIcons();
        requestAnimationFrame(() => {
            const list = $("#aiMessageList");
            if (list) list.scrollTop = list.scrollHeight;
            autoResizeAiPrompt();
        });
        ensureAiStatus();
    }

    function renderAiAttachmentList(attachments = []) {
        if (!attachments.length) return "";
        return `<div class="ai-attachment-chips">${attachments.map((attachment, index) => `
            <span class="ai-attachment-chip" title="${escapeAttr(attachment.name || "Documento")}">
                <span class="ai-attachment-chip-preview">${attachment.dataUrl ? `<img src="${escapeAttr(attachment.dataUrl)}" alt="">` : `<i data-lucide="file-check-2"></i>`}</span>
                <span>${escapeHtml(attachment.name || `Documento ${index + 1}`)}</span>
                <button type="button" data-ai-remove-attachment="${index}" aria-label="Remover anexo"><i data-lucide="x"></i></button>
            </span>`).join("")}</div>`;
    }

    async function addAiAttachments(fileList) {
        const files = Array.from(fileList || []);
        if (!files.length || state.aiAttachmentBusy) return;
        state.aiAttachmentBusy = true;
        if (state.view === "ai") renderAi();
        let added = 0;
        try {
            for (const file of files) {
                const remaining = 6 - state.aiAttachments.length;
                if (remaining <= 0) break;
                if (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")) {
                    if (file.size > 12 * 1024 * 1024) throw new Error(`O PDF ${file.name} excede 12 MB.`);
                    const pages = await pdfFileToAiAttachments(file, Math.min(remaining, 3));
                    for (const page of pages) {
                        if (state.aiAttachments.length >= 6) break;
                        state.aiAttachments.push(page);
                        added += 1;
                    }
                    continue;
                }
                if (!/^image\/(jpeg|png|webp)$/i.test(file.type || "")) {
                    toast(`Formato não aceito: ${file.name}. Use JPG, PNG, WEBP ou PDF.`, "error");
                    continue;
                }
                if (file.size > 8 * 1024 * 1024) throw new Error(`A imagem ${file.name} excede 8 MB.`);
                state.aiAttachments.push(await imageFileToAiAttachment(file));
                added += 1;
            }
            if (files.length && state.aiAttachments.length >= 6) toast("Limite de 6 imagens ou páginas por solicitação.");
            if (added) toast(`${added} anexo(s) preparado(s) para a IA.`, "success");
        } catch (error) {
            toast(translateError(error), "error");
        } finally {
            state.aiAttachmentBusy = false;
            if (state.view === "ai") renderAi();
        }
    }

    function imageFileToAiAttachment(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error || new Error("Falha ao ler a imagem."));
            reader.onload = () => {
                const image = new Image();
                image.onerror = () => reject(new Error(`A imagem ${file.name} não pôde ser aberta.`));
                image.onload = () => {
                    const maxDimension = 2400;
                    const ratio = Math.min(1, maxDimension / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
                    const width = Math.max(1, Math.round(image.naturalWidth * ratio));
                    const height = Math.max(1, Math.round(image.naturalHeight * ratio));
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const context = canvas.getContext("2d", { alpha: false });
                    context.fillStyle = "#ffffff";
                    context.fillRect(0, 0, width, height);
                    context.drawImage(image, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
                    resolve({
                        id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
                        name: String(file.name || "documento.jpg").replace(/\.[^.]+$/, "") + ".jpg",
                        type: "image/jpeg",
                        size: Math.round(dataUrl.length * 0.75),
                        dataUrl,
                    });
                };
                image.src = String(reader.result || "");
            };
            reader.readAsDataURL(file);
        });
    }

    async function pdfFileToAiAttachments(file, maxPages = 3) {
        if (!window.pdfjsLib) throw new Error("O leitor de PDF não foi carregado. Recarregue a página.");
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const loading = window.pdfjsLib.getDocument({ data: await file.arrayBuffer() });
        const pdf = await loading.promise;
        const output = [];
        try {
            const total = Math.min(pdf.numPages, Math.max(1, maxPages));
            for (let index = 1; index <= total; index += 1) {
                const page = await pdf.getPage(index);
                const base = page.getViewport({ scale: 1 });
                const scale = Math.min(2.2, 2400 / Math.max(base.width, base.height));
                const viewport = page.getViewport({ scale: Math.max(1, scale) });
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(viewport.width));
                canvas.height = Math.max(1, Math.round(viewport.height));
                const context = canvas.getContext("2d", { alpha: false });
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                await page.render({ canvasContext: context, viewport }).promise;
                const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
                output.push({
                    id: crypto.randomUUID?.() || `${Date.now()}-${index}-${Math.random()}`,
                    name: `${String(file.name || "documento.pdf").replace(/\.pdf$/i, "")}-pagina-${index}.jpg`,
                    type: "image/jpeg",
                    size: Math.round(dataUrl.length * 0.75),
                    dataUrl,
                });
            }
        } finally {
            try { await pdf.destroy(); } catch (_) {}
        }
        return output;
    }

    async function ensureAiStatus(force = false) {
        if (!window.DocSpaceAI?.isPrepared || state.aiStatusLoading) return;
        if (state.aiStatusChecked && !force) return;
        state.aiStatusLoading = true;
        state.aiStatusError = "";
        try {
            state.aiStatus = await window.DocSpaceAI.getStatus();
            state.aiStatusChecked = true;
        } catch (error) {
            state.aiStatus = null;
            state.aiStatusChecked = true;
            state.aiStatusError = translateError(error);
        } finally {
            state.aiStatusLoading = false;
            if (state.view === "ai") renderAi();
        }
    }

    function renderAiThinking() {
        return `<article class="ai-message ai-message-assistant ai-message-thinking" aria-label="A IA está analisando os documentos">
            <span class="ai-message-avatar"><i data-lucide="sparkles"></i></span>
            <div>
                <header><strong>DocSpace IA</strong><small>${escapeHtml(state.aiBusyStage || "Analisando...")}</small></header>
                <div class="ai-thinking-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            </div>
        </article>`;
    }

    function renderAiMissingField(field, currentValue = "") {
        const name = canonicalFieldName(field.name);
        const label = field.label || field.name;
        const options = Array.isArray(field.options) ? field.options : [];
        if (options.length) {
            return `<label class="field"><span>${escapeHtml(label)}</span><select name="${escapeAttr(name)}" data-field-name="${escapeAttr(name)}" required><option value="">Selecione</option>${options.map((option) => `<option value="${escapeAttr(option.value)}" ${String(option.value) === String(currentValue) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>`;
        }
        const selectType = getSimplifiedSelectType(name, label);
        if (selectType) {
            const optionsList = SIMPLIFIED_SELECT_OPTIONS[selectType] || [];
            return `<label class="field"><span>${escapeHtml(label)}</span><select name="${escapeAttr(name)}" data-field-name="${escapeAttr(name)}" required><option value="">Selecione</option>${optionsList.map(([value, optionLabel]) => `<option value="${escapeAttr(value)}" ${String(value) === String(currentValue) ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`).join("")}</select></label>`;
        }
        const long = isLongField(name, label);
        const control = long
            ? `<textarea name="${escapeAttr(name)}" data-field-name="${escapeAttr(name)}" rows="2" required>${escapeHtml(currentValue)}</textarea>`
            : `<input name="${escapeAttr(name)}" data-field-name="${escapeAttr(name)}" value="${escapeAttr(currentValue)}" placeholder="${escapeAttr(placeholderFor(name))}" ${smartAttributesFor(name, label)} required>`;
        return `<label class="field ${long ? "wide" : ""}"><span>${escapeHtml(label)}</span>${control}</label>`;
    }

    function renderAiTemplateDialog() {
        const dialog = state.aiTemplateDialog;
        if (!dialog) return "";
        if (dialog.type === "missing-fields") {
            const message = state.aiMessages?.[Number(dialog.messageIndex)];
            const doc = DOC_MAP.get(dialog.docId);
            if (!message || !doc) return "";
            const fieldsByName = new Map(getRelevantAiTemplateFields(doc, message.templateData || {}).map((field) => [canonicalFieldName(field.name), field]));
            const fields = (dialog.missingFieldNames || []).map((name) => fieldsByName.get(canonicalFieldName(name))).filter(Boolean);
            return `<div class="ai-template-modal-backdrop" role="presentation">
                <section class="ai-template-modal ai-missing-modal" role="dialog" aria-modal="true" aria-labelledby="aiMissingTitle">
                    <header><span><i data-lucide="clipboard-pen-line"></i></span><div><p class="eyebrow">Antes de gerar</p><h3 id="aiMissingTitle">Complete os dados que não estavam nos anexos</h3></div></header>
                    <p>A IA não inventará informações. Preencha os campos abaixo; a data da assinatura já usa automaticamente a data atual.</p>
                    <form id="aiMissingFieldsForm" data-message-index="${Number(dialog.messageIndex)}">
                        <div class="form-grid ai-missing-fields-grid">${fields.map((field) => renderAiMissingField(field, message.templateData?.[canonicalFieldName(field.name)] || "")).join("")}</div>
                        <p id="aiMissingFieldsMessage" class="message"></p>
                        <footer><button type="button" class="ghost-button" data-ai-template-cancel>Responder depois</button><button type="submit" class="primary-button"><i data-lucide="check"></i> Confirmar dados</button></footer>
                    </form>
                </section>
            </div>`;
        }
        if (dialog.docId !== "comodato") return "";
        return `<div class="ai-template-modal-backdrop" role="presentation">
            <section class="ai-template-modal" role="dialog" aria-modal="true" aria-labelledby="aiTemplateDialogTitle">
                <header>
                    <span><i data-lucide="file-check-2"></i></span>
                    <div><p class="eyebrow">Modelo integrado</p><h3 id="aiTemplateDialogTitle">Como é o contrato de comodato?</h3></div>
                </header>
                <p>O arquivo final usará exatamente o DOCX cadastrado no sistema. Escolha a variação antes da leitura dos documentos.</p>
                <form id="aiTemplateOptionsForm">
                    <fieldset>
                        <legend>Natureza do contrato</legend>
                        <label class="ai-option-card"><input type="radio" name="onus" value="sem_onus" required><span><strong>Sem ônus (gratuito)</strong><small>Modelo atual do sistema. Mantém cláusulas e layout originais.</small></span></label>
                        <label class="ai-option-card is-unavailable"><input type="radio" name="onus" value="com_onus" disabled><span><strong>Com ônus</strong><small>Ainda não existe um DOCX oneroso cadastrado. O sistema não inventará cláusulas.</small></span></label>
                    </fieldset>
                    <div class="ai-template-grid">
                        <fieldset><legend>O comodante possui cônjuge?</legend><label class="ai-option-card"><input type="radio" name="possui_conjuge" value="nao" required><span><strong>Não</strong></span></label><label class="ai-option-card"><input type="radio" name="possui_conjuge" value="sim" required><span><strong>Sim</strong></span></label></fieldset>
                        <fieldset><legend>O comodante é falecido?</legend><label class="ai-option-card"><input type="radio" name="possui_obito" value="nao" required><span><strong>Não</strong></span></label><label class="ai-option-card"><input type="radio" name="possui_obito" value="sim" required><span><strong>Sim</strong></span></label></fieldset>
                    </div>
                    <p id="aiTemplateOptionsMessage" class="message"></p>
                    <footer><button type="button" class="ghost-button" data-ai-template-cancel>Cancelar</button><button type="submit" class="primary-button"><i data-lucide="arrow-right"></i> Continuar</button></footer>
                </form>
            </section>
        </div>`;
    }

    function renderAiTemplateDataPreview(message) {
        if (!message?.templateId || !message?.templateData) return "";
        const doc = DOC_MAP.get(message.templateId);
        if (!doc) return "";
        const labels = new Map(getAiTemplateFields(doc).map((field) => [canonicalFieldName(field.name), field.label || field.name]));
        const rows = Object.entries(message.templateData)
            .filter(([key, value]) => labels.has(canonicalFieldName(key)) && String(value || "").trim() && !/^\[PREENCHER\]$/i.test(String(value).trim()))
            .slice(0, 10);
        if (!rows.length) return `<div class="ai-data-preview"><strong>Nenhum dado seguro foi identificado.</strong><small>Abra “Conferir dados” e preencha os campos manualmente.</small></div>`;
        return `<div class="ai-data-preview"><strong>Dados identificados — confira:</strong><dl>${rows.map(([key, value]) => `<div><dt>${escapeHtml(labels.get(canonicalFieldName(key)) || key)}</dt><dd>${escapeHtml(String(value))}</dd></div>`).join("")}</dl>${Object.keys(message.templateData).length > rows.length ? `<small>Abra “Conferir dados” para revisar todos os campos.</small>` : ""}</div>`;
    }

    function renderAiMessage(message, index = 0) {
        const role = message?.role === "assistant" ? "assistant" : "user";
        const title = role === "assistant" ? "DocSpace IA" : "Você";
        const icon = role === "assistant" ? "sparkles" : "user";
        const attachments = Array.isArray(message?.attachments) ? message.attachments : [];
        const attachmentHtml = role === "user" && attachments.length
            ? `<div class="ai-message-attachments">${attachments.map((attachment, attachmentIndex) => attachment.dataUrl
                ? `<img src="${escapeAttr(attachment.dataUrl)}" alt="${escapeAttr(attachment.name || `Documento ${attachmentIndex + 1}`)}" title="${escapeAttr(attachment.name || "Documento anexado")}">`
                : `<span class="ai-message-file"><i data-lucide="file-check-2"></i>${escapeHtml(attachment.name || `Documento ${attachmentIndex + 1}`)}</span>`).join("")}</div>`
            : "";
        const dataPreview = role === "assistant" ? renderAiTemplateDataPreview(message) : "";
        let actions = "";
        if (role === "assistant" && message?.templateId) {
            const waiting = message.templateDownloadReady === false;
            actions = `<div class="ai-template-result-badge"><i data-lucide="badge-check"></i> Arquivo baseado no modelo original do sistema</div>
                <div class="ai-document-actions">
                    ${waiting ? `<button type="button" class="primary-button" data-ai-answer-missing="${index}"><i data-lucide="message-square-more"></i> Responder campos faltantes</button>` : ""}
                    <button type="button" data-ai-open-template="${index}"><i data-lucide="list-checks"></i> Conferir todos os dados</button>
                    ${waiting ? "" : `<button type="button" data-ai-template-word="${index}" ${state.aiExportBusy !== null ? "disabled" : ""}><i data-lucide="file-type-2"></i> Word no modelo</button><button type="button" data-ai-template-pdf="${index}" ${state.aiExportBusy !== null ? "disabled" : ""}><i data-lucide="file-down"></i> PDF no modelo</button>`}
                </div>`;
        } else if (role === "assistant") {
            actions = `<div class="ai-document-actions"><button type="button" data-ai-copy="${index}"><i data-lucide="copy"></i> Copiar</button></div>`;
        }
        return `<article class="ai-message ai-message-${role}">
            <span class="ai-message-avatar"><i data-lucide="${icon}"></i></span>
            <div><header><strong>${title}</strong></header>${attachmentHtml}<div class="ai-message-content">${formatAiContent(message?.content || "")}</div>${dataPreview}${actions}</div>
        </article>`;
    }


    function formatAiContent(value) {
        return escapeHtml(String(value || ""))
            .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/^###\s+(.+)$/gm, "<h4>$1</h4>")
            .replace(/^##\s+(.+)$/gm, "<h3>$1</h3>")
            .replace(/^#\s+(.+)$/gm, "<h2>$1</h2>")
            .replace(/^[-*]\s+(.+)$/gm, "<div class=\"ai-list-item\">• $1</div>")
            .replace(/\n/g, "<br>");
    }

    function normalizeAiLookup(value) {
        return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    }

    function findRequestedDoc(prompt) {
        const text = normalizeAiLookup(prompt);
        if (!text) return null;
        const aliases = {
            "comodato": ["contrato de comodato rural", "contrato comodato rural", "comodato rural", "contrato de comodato", "comodato"],
            "contrato-comodato-equipamentos": ["comodato de equipamentos", "comodato equipamentos", "emprestimo de equipamentos"],
            "declaracao-residencia": ["declaracao de residencia", "comprovante de residencia"],
            "procuracao-normal": ["procuracao normal", "procuracao ad judicia", "procuracao judicial", "procuracao"],
            "procuracao-consumidor": ["procuracao consumidor", "procuracao consumerista"],
            "contrato-arrendamento-rural": ["contrato de arrendamento rural", "arrendamento rural"],
            "contrato-parceria-rural": ["contrato de parceria rural", "parceria rural"],
            "contrato-compra-venda-veiculo": ["compra e venda de veiculo", "compra venda veiculo", "venda de carro", "venda de moto"],
            "contrato-compra-venda-imovel": ["contrato de compra e venda", "compra e venda de imovel", "compra venda imovel"],
            "declaracao-uniao-estavel": ["declaracao de uniao estavel", "uniao estavel"],
            "declaracao-baixa-renda": ["declaracao de baixa renda", "baixa renda"],
            "declaracao-nao-possuir-renda": ["declaracao de nao possuir renda", "nao possui renda", "sem renda"],
            "declaracao-atividade-rural": ["declaracao de atividade rural", "atividade rural"],
            "declaracao-tempo-trabalho-rural": ["declaracao de tempo de trabalho rural", "tempo de trabalho rural"],
            "declaracao-posse-mansa-pacifica": ["declaracao de posse mansa e pacifica", "posse mansa e pacifica"],
            "declaracao-autenticidade-documentos": ["declaracao de autenticidade de documentos", "autenticidade de documentos"],
            "declaracao-dependencia-economica": ["declaracao de dependencia economica", "dependencia economica"],
            "declaracao-convivencia-familiar": ["declaracao de convivencia familiar", "convivencia familiar"],
            "declaracao-agricultura-familiar": ["declaracao de agricultura familiar", "agricultura familiar"],
            "ufba-membros": ["declaracao ufba", "ufba membros"],
            "renda-membros": ["declaracao de renda de membros", "declaracao de renda", "renda dos membros"],
            "posse": ["declaracao de posse", "declaracao posse"],
            "autodeclaracao-rural": ["autodeclaracao rural", "auto declaracao rural"],
            "contrato-honorarios-50": ["contrato de honorarios 50", "honorarios 50"],
            "contrato-prev-40": ["contrato previdenciario 40", "previdenciario 40"],
            "contrato-prev-30": ["contrato previdenciario 30", "previdenciario 30"],
            "cadastro-confrontantes": ["cadastro de confrontantes", "confrontantes"],
            "controle-producao-anual": ["controle de producao anual", "producao anual"],
            "controle-rebanho": ["controle de rebanho", "rebanho"],
            "inventario-producao-rural": ["inventario de producao rural", "inventario rural"],
        };
        // Casos específicos primeiro para não confundir modelos de nomes parecidos.
        const priorityIds = ["contrato-comodato-equipamentos", "comodato", "procuracao-consumidor", "procuracao-normal", "contrato-compra-venda-veiculo", "contrato-compra-venda-imovel"];
        for (const id of [...priorityIds, ...Object.keys(aliases).filter((id) => !priorityIds.includes(id))]) {
            if ((aliases[id] || []).some((alias) => text.includes(normalizeAiLookup(alias)))) return DOC_MAP.get(id) || null;
        }
        let best = null;
        let bestScore = 0;
        for (const doc of DOCS) {
            const title = normalizeAiLookup(doc.title);
            if (text.includes(title)) return doc;
            const tokens = title.split(" ").filter((token) => token.length > 3 && !["contrato", "declaracao", "rural", "normal"].includes(token));
            const score = tokens.filter((token) => text.includes(token)).length;
            if (score > bestScore) { best = doc; bestScore = score; }
        }
        return bestScore >= 2 ? best : null;
    }

    function getAiTemplateFields(doc) {
        return [...(doc?.fields || []), ...(doc?.choices || [])].map((item) => ({ name: item.name, label: item.label || item.name, options: item.options || [] }));
    }

    function getRelevantAiTemplateFields(doc, data = {}) {
        const fields = getAiTemplateFields(doc);
        if (doc?.id !== "comodato") return fields;
        const hasSpouse = String(data.possui_conjuge || "nao") === "sim";
        const hasDeath = String(data.possui_obito || "nao") === "sim";
        return fields.filter((field) => {
            const key = canonicalFieldName(field.name);
            if (!hasSpouse && /conjuge/.test(key)) return false;
            if (!hasDeath && /(falecido|obito|representante)/.test(key)) return false;
            return true;
        });
    }

    function currentBrazilDateValues(date = new Date()) {
        const parts = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(date);
        const get = (type) => parts.find((part) => part.type === type)?.value || "";
        const day = get("day");
        const monthNumber = get("month");
        const year = get("year");
        const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        const monthName = months[Math.max(0, Number(monthNumber) - 1)] || monthNumber;
        return { day, monthNumber, monthName, year, numeric: `${day}/${monthNumber}/${year}`, extended: `${day} de ${monthName} de ${year}` };
    }

    function applyCurrentSignatureDateDefaults(doc, data = {}) {
        const values = currentBrazilDateValues();
        const available = new Set(getAiTemplateFields(doc).map((field) => canonicalFieldName(field.name)));
        const put = (key, value) => {
            const canonical = canonicalFieldName(key);
            if (available.has(canonical)) data[canonical] = value;
        };
        put("dia", values.day);
        put("mes", values.monthName);
        put("ano", values.year);
        getAiTemplateFields(doc).forEach((field) => {
            const key = canonicalFieldName(field.name);
            const text = normalizeAiLookup(`${field.name} ${field.label || ""}`);
            if (/data assinatura extenso|data atual extenso|data documento extenso/.test(text)) data[key] = values.extended;
            else if (/data assinatura|data atual|data documento/.test(text) || key === "data") data[key] = values.numeric;
        });
        return data;
    }

    function applyCurrentSignatureDateToForm(form, doc) {
        if (!form || !doc) return;
        const values = currentBrazilDateValues();
        const set = (name, value) => {
            const field = form.elements?.namedItem?.(name) || form.querySelector(`[name="${CSS.escape(name)}"]`);
            if (field && "value" in field) field.value = value;
        };
        getAiTemplateFields(doc).forEach((field) => {
            const name = canonicalFieldName(field.name);
            const text = normalizeAiLookup(`${name} ${field.label || ""}`);
            if (name === "dia") return set(name, values.day);
            if (name === "mes") return set(name, values.monthName);
            if (name === "ano") return set(name, values.year);
            if (/data assinatura extenso|data atual extenso|data documento extenso/.test(text)) return set(name, values.extended);
            if (/data assinatura|data atual|data documento/.test(text) || name === "data") return set(name, values.numeric);
        });
    }

    function parseAiJson(value) {
        const raw = String(value || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
        try { return JSON.parse(raw); } catch (_) {}
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1));
        throw new Error("A IA não retornou os dados em formato verificável.");
    }

    function normalizeExtractedTemplateData(doc, payload, forcedValues = {}) {
        const definitions = new Map(getAiTemplateFields(doc).map((field) => [canonicalFieldName(field.name), field]));
        const allowed = new Set(definitions.keys());
        const source = payload?.fields && typeof payload.fields === "object" ? payload.fields : payload;
        const fields = {};
        const issues = [];
        Object.entries(source && typeof source === "object" ? source : {}).forEach(([key, value]) => {
            const canonical = canonicalFieldName(key);
            if (!allowed.has(canonical) || value == null || typeof value === "object") return;
            let clean = String(value).trim();
            if (!clean || /^\[?(?:preencher|nao identificado|não identificado|ilegivel|ilegível|null|undefined)\]?$/i.test(clean)) return;
            const definition = definitions.get(canonical);
            if (definition?.options?.length) {
                const normalized = normalizeAiLookup(clean);
                const matched = definition.options.find((option) => [option.value, option.label].some((candidate) => normalizeAiLookup(candidate) === normalized));
                if (!matched) {
                    issues.push(`Selecione uma opção válida para ${definition.label || definition.name}.`);
                    return;
                }
                clean = String(matched.value);
            }
            fields[canonical] = clean;
        });
        Object.assign(fields, forcedValues || {});
        applyCommonTemplateAliases(fields);
        if (doc.id === "comodato") applyComodatoAliases(fields);
        applyReverseTemplateAliases(fields);
        Object.entries({ ...fields }).forEach(([key, value]) => {
            if (!/cpf/i.test(key)) return;
            const digits = digitsOnly(value);
            const valid = (digits.length === 11 && isValidCpf(digits)) || (digits.length === 14 && isValidCnpj(digits));
            if (!valid) {
                delete fields[key];
                issues.push(`CPF/CNPJ precisa ser conferido: ${key}.`);
            }
        });
        const providerIssues = [payload?.unreadable, payload?.conflicts, payload?.notes].flat().filter(Boolean).map(String);
        return { fields, issues: [...new Set([...issues, ...providerIssues])].slice(0, 30) };
    }

    function templateMissingFields(doc, data) {
        return getRelevantAiTemplateFields(doc, data).filter((field) => {
            const value = String(data[canonicalFieldName(field.name)] || "").trim();
            if (!value || /^\[PREENCHER\]$/i.test(value)) return true;
            if (Array.isArray(field.options) && field.options.length) {
                return !field.options.some((option) => String(option.value) === value);
            }
            return false;
        });
    }

    function templateMissingLabels(doc, data) {
        return templateMissingFields(doc, data).map((field) => field.label || field.name);
    }

    function inferAiMode(prompt, attachments = []) {
        const text = normalizeAiLookup(prompt);
        if (attachments.length && /(extrair|identificar|ler|conferir|dados)/.test(text)) return "extract-fields";
        if (/(revisar|corrigir|melhorar|analisar)/.test(text)) return "review";
        if (/(gerar|criar|fazer|montar|redigir)/.test(text)) return "draft";
        return attachments.length ? "extract-fields" : "assist";
    }

    async function submitAi(event) {
        event.preventDefault();
        if (state.aiBusy || state.aiAttachmentBusy) return;
        const form = event.target?.matches?.("#aiForm") ? event.target : event.target?.closest?.("#aiForm");
        const typedPrompt = String(form?.elements?.namedItem?.("prompt")?.value || "").trim();
        const mode = inferAiMode(typedPrompt, state.aiAttachments || []);
        const attachments = (state.aiAttachments || []).map((attachment) => ({ name: attachment.name, type: attachment.type, dataUrl: attachment.dataUrl }));
        if (!typedPrompt && !attachments.length) { setMessage($("#aiMessage"), "Escreva o que deseja gerar ou anexe um documento.", "error"); return; }
        if (attachments.length && !form?.elements?.namedItem?.("documentConsent")?.checked) { setMessage($("#aiMessage"), "Confirme a autorização para enviar os documentos à IA.", "error"); return; }
        if (!window.DocSpaceAI?.isEnabled) { setMessage($("#aiMessage"), "A IA ainda não foi ativada no frontend.", "error"); return; }
        if (state.aiStatusChecked && state.aiStatus?.enabled === false) { setMessage($("#aiMessage"), "A IA está desativada no Worker. Confira AI_ENABLED e a chave do provedor.", "error"); return; }
        const prompt = typedPrompt || "Analise os documentos anexados e informe os dados legíveis. Não presuma nenhum número.";
        const targetDoc = findRequestedDoc(prompt);
        state.aiMode = mode;
        state.aiMessages.push({ role: "user", content: prompt, attachments });
        state.aiDrafts[state.aiArea] = "";
        persistAiDraft(state.aiArea, "");
        state.aiAttachments = [];
        state.aiAttachMenuOpen = false;
        persistAiConversation();
        const request = { prompt, mode, attachments, targetDocId: targetDoc?.id || "" };
        if (!targetDoc && mode === "draft" && state.aiArea === "documents") {
            state.aiMessages.push({ role: "assistant", content: "Para preservar exatamente o layout e as cláusulas do DocSpace, preciso saber qual modelo integrado você quer usar. Escreva o nome do documento, por exemplo: contrato de comodato, declaração de residência, procuração ou contrato de arrendamento rural." });
            persistAiConversation();
            renderAi();
            return;
        }
        if (targetDoc?.id === "comodato") {
            state.aiPendingTemplateRequest = request;
            state.aiTemplateDialog = { type: "comodato-options", docId: "comodato" };
            renderAi();
            return;
        }
        await processAiRequest(request, targetDoc, {});
    }

    async function confirmAiTemplateOptions(event) {
        event.preventDefault();
        const form = event.target?.matches?.("#aiTemplateOptionsForm") ? event.target : event.target?.closest?.("#aiTemplateOptionsForm");
        const onus = String(form.elements?.namedItem?.("onus")?.value || "");
        const possuiConjuge = String(form.elements?.namedItem?.("possui_conjuge")?.value || "");
        const possuiObito = String(form.elements?.namedItem?.("possui_obito")?.value || "");
        if (!onus || !possuiConjuge || !possuiObito) {
            setMessage($("#aiTemplateOptionsMessage"), "Selecione a natureza, o cônjuge e a situação de óbito.", "error");
            return;
        }
        if (onus !== "sem_onus") {
            setMessage($("#aiTemplateOptionsMessage"), "Não existe modelo com ônus cadastrado. Envie o DOCX correto para que ele seja integrado sem alterar cláusulas.", "error");
            return;
        }
        const request = state.aiPendingTemplateRequest;
        state.aiPendingTemplateRequest = null;
        state.aiTemplateDialog = null;
        if (!request) { renderAi(); return; }
        await processAiRequest(request, DOC_MAP.get("comodato"), { possui_conjuge: possuiConjuge, possui_obito: possuiObito, modalidade_comodato: onus });
    }

    async function completeAiMissingFields(event) {
        event.preventDefault();
        const form = event.target?.matches?.("#aiMissingFieldsForm") ? event.target : event.target?.closest?.("#aiMissingFieldsForm");
        const index = Number(form?.dataset?.messageIndex);
        const { message, doc } = getAiTemplateMessage(index);
        const controls = Array.from(form?.querySelectorAll?.("[data-field-name]") || []);
        controls.forEach((control) => validateSmartField(control));
        if (controls.some((control) => control.classList.contains("is-invalid"))) {
            setMessage($("#aiMissingFieldsMessage"), "Confira os campos destacados antes de gerar o documento.", "error");
            return;
        }
        const data = { ...(message.templateData || {}) };
        const fd = new FormData(form);
        for (const [key, value] of fd.entries()) {
            const clean = String(value || "").trim();
            if (clean) data[canonicalFieldName(key)] = clean;
        }
        applyCurrentSignatureDateDefaults(doc, data);
        applyCommonTemplateAliases(data);
        if (doc.id === "comodato") applyComodatoAliases(data);
        applyReverseTemplateAliases(data);
        const missingFields = templateMissingFields(doc, data);
        if (missingFields.length) {
            setMessage($("#aiMissingFieldsMessage"), `Ainda faltam ${missingFields.length} campo(s). Preencha todos para liberar o Word e o PDF.`, "error");
            return;
        }
        message.templateData = data;
        message.templateDownloadReady = true;
        message.missingFields = [];
        message.content = `${String(message.content || "").split("\n\n**Campos ainda não identificados")[0]}\n\n**Dados obrigatórios confirmados.** O documento está pronto para conferência final e geração no modelo original.`;
        state.aiTemplateDialog = null;
        persistAiConversation();
        renderAi();
        toast("Dados confirmados. Word e PDF liberados.", "success");
    }

    async function processAiRequest(request, targetDoc, forcedValues = {}) {
        state.aiBusy = true;
        state.aiBusyStage = request.attachments?.length ? "Lendo e conferindo os documentos..." : "Organizando os dados...";
        renderAi();
        try {
            if (targetDoc) {
                const fields = getAiTemplateFields(targetDoc);
                const result = await window.DocSpaceAI.run("extract-fields", {
                    prompt: `Preencha somente os campos do modelo integrado \"${targetDoc.title}\" com os dados claramente presentes no pedido e nas imagens. Identifique corretamente quem é cada pessoa (comodante, comodatário, cônjuge, representante etc.). Não invente, não complete dígitos e não altere cláusulas. Pedido do usuário: ${request.prompt}`,
                    images: request.attachments,
                    history: buildAiHistoryPayload(),
                    context: {
                        area: "documents",
                        templateId: targetDoc.id,
                        documentType: targetDoc.title,
                        templateFields: fields.map((field) => field.name),
                        templateFieldLabels: Object.fromEntries(fields.map((field) => [field.name, field.label])),
                        templateChoices: Object.fromEntries(fields.filter((field) => field.options?.length).map((field) => [field.name, field.options])),
                        forcedValues,
                        attachmentNames: request.attachments.map((attachment) => attachment.name),
                    },
                });
                const parsed = parseAiJson(result.content);
                const extracted = normalizeExtractedTemplateData(targetDoc, parsed, forcedValues);
                applyCurrentSignatureDateDefaults(targetDoc, extracted.fields);
                const missingFields = templateMissingFields(targetDoc, extracted.fields);
                const missing = missingFields.map((field) => field.label || field.name);
                const unresolvedChoices = (targetDoc.choices || []).filter((choice) => !(choice.options || []).some((option) => String(option.value) === String(extracted.fields[canonicalFieldName(choice.name)] || "")));
                const relevantFields = getRelevantAiTemplateFields(targetDoc, extracted.fields);
                const identified = Math.max(0, relevantFields.length - missing.length);
                const issueText = extracted.issues.length ? `\n\n**Dados que precisam de conferência:**\n- ${extracted.issues.join("\n- ")}` : "";
                const missingText = missing.length ? `\n\n**Campos ainda não identificados (${missing.length}):**\n- ${missing.slice(0, 18).join("\n- ")}${missing.length > 18 ? `\n- e mais ${missing.length - 18}` : ""}` : "\n\nTodos os campos do modelo foram identificados. Mesmo assim, confira antes de usar.";
                const templateReady = missingFields.length === 0 && unresolvedChoices.length === 0;
                const messageIndex = state.aiMessages.length;
                state.aiMessages.push({
                    role: "assistant",
                    content: `Usei o modelo integrado **${targetDoc.title}**. Identifiquei ${identified} de ${relevantFields.length} campos obrigatórios para esta variação. A data de assinatura foi preenchida automaticamente com a data atual quando o modelo possui esse campo. O Word e o PDF serão preenchidos diretamente no DOCX original, sem recriar o layout e sem modificar as cláusulas.${issueText}${missingText}`,
                    templateId: targetDoc.id,
                    templateData: extracted.fields,
                    templateOptions: forcedValues,
                    templateDownloadReady: templateReady,
                    missingFields: missingFields.map((field) => canonicalFieldName(field.name)),
                });
                if (!templateReady && missingFields.length) {
                    state.aiTemplateDialog = { type: "missing-fields", docId: targetDoc.id, messageIndex, missingFieldNames: missingFields.map((field) => canonicalFieldName(field.name)) };
                }
                persistAiConversation();
            } else {
                const result = await window.DocSpaceAI.run(request.mode || "assist", {
                    prompt: request.prompt,
                    images: request.attachments,
                    history: buildAiHistoryPayload(),
                    context: {
                        area: state.aiArea === "office" ? "office" : "documents",
                        hasAttachments: Boolean(request.attachments.length),
                        attachmentNames: request.attachments.map((attachment) => attachment.name),
                        availableTemplates: DOCS.map((doc) => ({ id: doc.id, title: doc.title, category: doc.category })).slice(0, 120),
                    },
                });
                state.aiMessages.push({ role: "assistant", content: result.content || "Resposta vazia." });
                persistAiConversation();
            }
        } catch (error) {
            state.aiMessages.push({ role: "assistant", content: `Não foi possível concluir a solicitação. ${translateError(error)}` });
            persistAiConversation();
            toast(translateError(error), "error");
        } finally {
            state.aiBusy = false;
            state.aiBusyStage = "";
            renderAi();
        }
    }

    function getAiTemplateMessage(index) {
        const message = state.aiMessages?.[Number(index)];
        if (!message || message.role !== "assistant" || !message.templateId) throw new Error("Resultado de modelo não encontrado.");
        const doc = DOC_MAP.get(message.templateId);
        if (!doc) throw new Error("Modelo integrado não encontrado.");
        return { message, doc };
    }

    function prepareAiTemplateData(doc, data = {}) {
        const output = { ...(data || {}) };
        applyCurrentSignatureDateDefaults(doc, output);
        getAiTemplateFields(doc).forEach((field) => {
            const key = canonicalFieldName(field.name);
            if (!String(output[key] || "").trim()) output[key] = "[PREENCHER]";
        });
        if (doc.id === "comodato") {
            output.possui_conjuge = data.possui_conjuge === "sim" ? "sim" : "nao";
            output.possui_obito = data.possui_obito === "sim" ? "sim" : "nao";
            applyComodatoAliases(output);
        }
        applyCommonTemplateAliases(output);
        applyReverseTemplateAliases(output);
        return output;
    }

    function openAiTemplateReview(index) {
        const { message, doc } = getAiTemplateMessage(index);
        state.pendingFormData = { ...(message.templateData || {}) };
        state.pendingFormStep = 0;
        state.view = "documents";
        state.activeDocId = doc.id;
        render();
    }

    async function downloadAiTemplate(index, format) {
        const { message, doc } = getAiTemplateMessage(index);
        const missingFields = templateMissingFields(doc, message.templateData || {});
        if (message.templateDownloadReady === false || missingFields.length) {
            state.aiTemplateDialog = { type: "missing-fields", docId: doc.id, messageIndex: Number(index), missingFieldNames: missingFields.map((field) => canonicalFieldName(field.name)) };
            renderAi();
            throw new Error("Complete os campos faltantes antes de gerar o documento.");
        }
        if (!message.quotaConsumed) {
            const usageResult = await apiRequest("/api/documents/usage", { method: "POST", body: { documentType: doc.id } });
            state.documentUsage = usageResult.documentUsage || state.documentUsage;
            message.quotaConsumed = true;
            persistAiConversation();
        }
        const data = prepareAiTemplateData(doc, message.templateData || {});
        const path = getModelPath(doc, data);
        const docxBlob = await buildDocx(path, data, doc);
        const wordName = getFileName(doc, data, "docx");
        if (format === "docx") {
            saveBlob(docxBlob, wordName);
            toast("Word gerado no modelo original do sistema.", "success");
            return;
        }
        const docxBase64 = await blobToBase64(docxBlob, true);
        const result = await apiRequest("/api/ai/export-pdf", { method: "POST", body: { docxBase64, fileName: wordName } });
        if (!result?.pdfBase64) throw new Error("O servidor não retornou o PDF.");
        downloadBase64(result.pdfBase64, result.fileName || getFileName(doc, data, "pdf"), "application/pdf");
        toast("PDF gerado a partir do modelo original.", "success");
    }

    function getAiMessageText(index) {
        const message = state.aiMessages?.[Number(index)];
        if (!message || message.role !== "assistant") throw new Error("Resposta da IA não encontrada.");
        return String(message.content || "").trim();
    }

    function sanitizeDownloadName(value, fallback = "documento-docspace") {
        return String(value || fallback)
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9_-]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || fallback;
    }

    function inferAiDocumentName(text) {
        const firstUseful = String(text || "").split(/\r?\n/).map((line) => line.replace(/^#+\s*/, "").trim()).find(Boolean) || "documento-docspace";
        return sanitizeDownloadName(firstUseful);
    }

    function xmlEscapeText(value) {
        return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    }

    function markdownInlineRuns(value, boldAll = false) {
        const text = String(value || "");
        const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        return parts.map((part) => {
            const bold = boldAll || /^\*\*[^*]+\*\*$/.test(part);
            const clean = part.replace(/^\*\*|\*\*$/g, "").replace(/`([^`]+)`/g, "$1").replace(/\*([^*]+)\*/g, "$1");
            return `<w:r>${bold ? '<w:rPr><w:b/></w:rPr>' : ''}<w:t xml:space="preserve">${xmlEscapeText(clean)}</w:t></w:r>`;
        }).join("");
    }

    function aiMarkdownToWordXml(markdown) {
        const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
        const paragraphs = [];
        for (const raw of lines) {
            const line = raw.trimEnd();
            if (!line.trim()) {
                paragraphs.push('<w:p><w:r><w:t></w:t></w:r></w:p>');
                continue;
            }
            const heading = /^(#{1,3})\s+(.+)$/.exec(line);
            if (heading) {
                const level = heading[1].length;
                const size = level === 1 ? 32 : level === 2 ? 28 : 24;
                paragraphs.push(`<w:p><w:pPr><w:spacing w:before="180" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t>${xmlEscapeText(heading[2])}</w:t></w:r></w:p>`);
                continue;
            }
            const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
            const numbered = /^\s*(\d+)[.)]\s+(.+)$/.exec(line);
            if (bullet || numbered) {
                const prefix = bullet ? "• " : `${numbered[1]}. `;
                const body = bullet ? bullet[1] : numbered[2];
                paragraphs.push(`<w:p><w:pPr><w:ind w:left="360" w:hanging="180"/><w:spacing w:after="80"/></w:pPr>${markdownInlineRuns(prefix + body)}</w:p>`);
                continue;
            }
            const isTitle = line.length < 90 && line === line.toUpperCase() && /[A-ZÁÉÍÓÚÃÕÇ]/.test(line);
            paragraphs.push(`<w:p><w:pPr><w:jc w:val="${isTitle ? "center" : "both"}"/><w:spacing w:after="120" w:line="360" w:lineRule="auto"/></w:pPr>${markdownInlineRuns(line, isTitle)}</w:p>`);
        }
        return paragraphs.join("");
    }

    async function buildAiDocxBlob(markdown, title = "Documento DocSpace") {
        await ensureDocxLibs();
        const zip = new window.PizZip();
        const now = new Date().toISOString();
        zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
        zip.folder("_rels").file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
        zip.folder("word").file("document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${aiMarkdownToWordXml(markdown)}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`);
        zip.folder("word").file("styles.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>`);
        zip.folder("word").folder("_rels").file("document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
        zip.folder("docProps").file("core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xmlEscapeText(title)}</dc:title><dc:creator>DocSpace IA</dc:creator><cp:lastModifiedBy>DocSpace IA</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`);
        zip.folder("docProps").file("app.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>DocSpace</Application><AppVersion>1.43</AppVersion></Properties>`);
        return zip.generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", compression: "DEFLATE" });
    }

    async function downloadAiWord(index) {
        const text = getAiMessageText(index);
        const name = inferAiDocumentName(text);
        state.aiExportBusy = `word-${index}`;
        renderAi();
        try {
            const blob = await buildAiDocxBlob(text, name);
            saveBlob(blob, `${name}.docx`);
            toast("Documento Word gerado.", "success");
        } finally {
            state.aiExportBusy = null;
            if (state.view === "ai") renderAi();
        }
    }

    async function downloadAiPdf(index) {
        const text = getAiMessageText(index);
        const name = inferAiDocumentName(text);
        state.aiExportBusy = `pdf-${index}`;
        renderAi();
        try {
            const blob = await buildAiDocxBlob(text, name);
            const docxBase64 = await blobToBase64(blob, true);
            const result = await apiRequest("/api/ai/export-pdf", {
                method: "POST",
                body: { docxBase64, fileName: `${name}.docx` },
            });
            if (!result?.pdfBase64) throw new Error("O servidor não retornou o PDF.");
            downloadBase64(result.pdfBase64, result.fileName || `${name}.pdf`, "application/pdf");
            toast("Documento PDF gerado.", "success");
        } finally {
            state.aiExportBusy = null;
            if (state.view === "ai") renderAi();
        }
    }

    function wordExportHtml(bodyHtml) {
        return `<!doctype html><html><head><meta charset="utf-8"><style>
            body{font-family:'Times New Roman',Times,serif;font-size:12pt;line-height:1.5;color:#111}
            h1{font-size:22pt;margin:0 0 12pt}h2{font-size:16pt;margin:18pt 0 8pt}h3{font-size:13pt;margin:14pt 0 6pt}
            p{margin:0 0 10pt}ul,ol{margin:0 0 10pt 24pt}blockquote{border-left:3px solid #999;margin:10pt 0;padding:4pt 12pt;color:#444}
            a{color:#1a56db;text-decoration:underline}
        </style></head><body>${bodyHtml || "<p></p>"}</body></html>`;
    }

    async function buildWordEditorBlob() {
        const editor = $("#wordEditor");
        const html = editor?.innerHTML || state.wordHtml || "<p></p>";
        state.wordHtml = html;
        if (window.htmlDocx?.asBlob) {
            return window.htmlDocx.asBlob(wordExportHtml(html), {
                orientation: "portrait",
                margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            });
        }
        return buildAiDocxBlob(editor?.innerText || html.replace(/<[^>]+>/g, " "), state.wordFileName || "Documento");
    }

    function resolveOfficeAiTarget(target = "") {
        if (target === "excel" || target === "word") return target;
        return state.view === "excel" ? "excel" : "word";
    }

    function launchOfficeAi(target = "") {
        const resolved = resolveOfficeAiTarget(target);
        state.officeAiTarget = resolved;
        state.officeAiOpen = true;
        state.officeAiBusy = false;
        state.officeAiError = "";
        state.officeAiMode = resolved === "word" ? "replace" : "replace";
        if (state.view !== resolved) {
            navigate(resolved);
            return;
        }
        resolved === "excel" ? renderExcelEditor() : renderWordEditor();
    }

    function closeOfficeAi() {
        const target = resolveOfficeAiTarget(state.officeAiTarget);
        state.officeAiOpen = false;
        state.officeAiBusy = false;
        state.officeAiError = "";
        target === "excel" ? renderExcelEditor() : renderWordEditor();
    }

    function officeAiExamplePrompts(target) {
        return target === "excel"
            ? [
                "Crie uma planilha de controle financeiro mensal com receitas, despesas, saldo e fórmulas.",
                "Monte uma planilha de estoque com produto, categoria, entrada, saída, quantidade atual e valor total.",
                "Crie um cronograma de estudos semanal com disciplina, assunto, duração, status e observações.",
            ]
            : [
                "Crie um relatório profissional com título, introdução, desenvolvimento, conclusão e recomendações.",
                "Redija uma ata de reunião com pauta, participantes, decisões, responsáveis e prazos.",
                "Revise e melhore o documento atual, preservando as informações e corrigindo clareza e organização.",
            ];
    }

    function renderOfficeAiDialog(target) {
        if (!state.officeAiOpen || resolveOfficeAiTarget(state.officeAiTarget) !== target) return "";
        const isWord = target === "word";
        const examples = officeAiExamplePrompts(target);
        const modes = isWord
            ? `<option value="replace" ${state.officeAiMode === "replace" ? "selected" : ""}>Criar um novo conteúdo e substituir o documento</option><option value="rewrite" ${state.officeAiMode === "rewrite" ? "selected" : ""}>Reescrever e melhorar o documento atual</option><option value="append" ${state.officeAiMode === "append" ? "selected" : ""}>Adicionar o conteúdo ao final do documento</option>`
            : `<option value="replace" ${state.officeAiMode === "replace" ? "selected" : ""}>Criar uma nova planilha e substituir a atual</option><option value="append" ${state.officeAiMode === "append" ? "selected" : ""}>Adicionar a nova tabela abaixo dos dados atuais</option>`;
        return `
            <div class="office-ai-overlay" data-office-ai-backdrop>
                <section class="office-ai-dialog" role="dialog" aria-modal="true" aria-labelledby="officeAiTitle">
                    <header class="office-ai-dialog-header">
                        <span class="office-ai-dialog-icon"><i data-lucide="sparkles"></i></span>
                        <div><small>IA contextual do Office</small><h2 id="officeAiTitle">${isWord ? "Assistente Word" : "Assistente Excel"}</h2><p>${isWord ? "O resultado será aplicado diretamente no documento aberto." : "A IA criará linhas, colunas, dados e fórmulas diretamente na planilha aberta."}</p></div>
                        <button type="button" class="ghost-button office-ai-close" data-office-ai-close aria-label="Fechar"><i data-lucide="x"></i></button>
                    </header>
                    <form id="officeAiForm" class="office-ai-form" data-office-ai-target="${target}">
                        <label class="field"><span>O que você quer que a IA faça?</span><textarea id="officeAiPrompt" name="prompt" rows="6" maxlength="24000" placeholder="Descreva o ${isWord ? "documento" : "conteúdo da planilha"}, as informações e o formato desejado..." required>${escapeHtml(state.officeAiPrompt || "")}</textarea></label>
                        <label class="field"><span>Como aplicar o resultado</span><select id="officeAiMode" name="mode">${modes}</select></label>
                        <div class="office-ai-context-note"><i data-lucide="scan-text"></i><span>${isWord ? "O Assistente Word recebe o texto atual como contexto e devolve conteúdo estruturado para o editor." : "O Assistente Excel recebe a tabela atual como contexto e devolve uma estrutura de linhas e colunas."}</span></div>
                        <div class="office-ai-examples">${examples.map((example) => `<button type="button" data-office-ai-example="${escapeAttr(example)}">${escapeHtml(example)}</button>`).join("")}</div>
                        ${state.officeAiError ? `<p class="message error office-ai-error">${escapeHtml(state.officeAiError)}</p>` : `<p class="message">A IA não baixa um arquivo separado: ela aplica o resultado dentro do ${isWord ? "Word" : "Excel"}.</p>`}
                        <footer class="office-ai-actions"><button type="button" class="ghost-button" data-office-ai-close>Cancelar</button><button type="submit" class="primary-button" ${state.officeAiBusy ? "disabled" : ""}><i data-lucide="${state.officeAiBusy ? "loader-circle" : "sparkles"}"></i> ${state.officeAiBusy ? "Gerando..." : isWord ? "Gerar no Word" : "Gerar no Excel"}</button></footer>
                    </form>
                </section>
            </div>`;
    }

    function sanitizeOfficeWordHtml(value) {
        const template = document.createElement("template");
        template.innerHTML = String(value || "");
        const allowed = new Set(["H1", "H2", "H3", "H4", "P", "BR", "STRONG", "B", "EM", "I", "U", "S", "UL", "OL", "LI", "BLOCKQUOTE", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD", "HR", "A", "DIV", "SPAN"]);
        const forbidden = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "FORM", "INPUT", "BUTTON", "TEXTAREA", "SELECT", "META", "LINK"]);
        Array.from(template.content.querySelectorAll("*")).forEach((node) => {
            if (forbidden.has(node.tagName)) {
                node.remove();
                return;
            }
            if (!allowed.has(node.tagName)) {
                node.replaceWith(...Array.from(node.childNodes));
                return;
            }
            Array.from(node.attributes).forEach((attribute) => {
                const name = attribute.name.toLowerCase();
                const keep = (node.tagName === "A" && ["href", "title"].includes(name)) || (["TD", "TH"].includes(node.tagName) && ["colspan", "rowspan"].includes(name));
                if (!keep || name.startsWith("on")) node.removeAttribute(attribute.name);
            });
            if (node.tagName === "A") {
                const href = String(node.getAttribute("href") || "").trim();
                if (!/^(https?:|mailto:)/i.test(href)) node.removeAttribute("href");
                else node.setAttribute("rel", "noopener noreferrer");
            }
        });
        return template.innerHTML.trim();
    }

    function normalizeOfficeExcelPayload(payload) {
        const columns = Array.isArray(payload?.columns) ? payload.columns.map((item) => String(item ?? "").slice(0, 500)) : [];
        const rows = Array.isArray(payload?.rows) ? payload.rows.filter(Array.isArray).map((row) => row.map((item) => String(item ?? "").slice(0, 2000))) : [];
        const data = columns.length ? [columns, ...rows] : rows;
        if (!data.length) throw new Error("A IA não retornou linhas para a planilha.");
        const limited = data.slice(0, 500).map((row) => row.slice(0, 60));
        const cols = Math.max(1, ...limited.map((row) => row.length));
        limited.forEach((row) => { while (row.length < cols) row.push(""); });
        return limited;
    }

    function appendExcelData(current, generated) {
        const base = (Array.isArray(current) ? current : []).map((row) => Array.isArray(row) ? [...row] : []);
        while (base.length && base[base.length - 1].every((cell) => !String(cell || "").trim())) base.pop();
        if (base.length) base.push(Array.from({ length: Math.max(base[0]?.length || 1, generated[0]?.length || 1) }, () => ""));
        return [...base, ...generated];
    }

    async function submitOfficeAi(event) {
        event.preventDefault();
        if (state.officeAiBusy) return;
        const form = event.target.closest("#officeAiForm");
        const target = resolveOfficeAiTarget(form?.dataset?.officeAiTarget);
        const prompt = String(form?.elements?.namedItem?.("prompt")?.value || "").trim();
        const mode = String(form?.elements?.namedItem?.("mode")?.value || "replace");
        if (!prompt) return;
        if (!window.DocSpaceAI?.isEnabled) {
            state.officeAiError = "A IA ainda não está ativada no frontend.";
            target === "excel" ? renderExcelEditor() : renderWordEditor();
            return;
        }
        state.officeAiPrompt = prompt;
        state.officeAiMode = mode;
        state.officeAiBusy = true;
        state.officeAiError = "";
        target === "excel" ? renderExcelEditor() : renderWordEditor();
        try {
            if (target === "word") {
                const holder = document.createElement("div");
                holder.innerHTML = state.wordHtml || "";
                const result = await window.DocSpaceAI.run("office-word", {
                    prompt,
                    history: [],
                    context: {
                        area: "office",
                        officeTarget: "word",
                        operation: mode,
                        currentFileName: state.wordFileName || "Documento",
                        currentContent: String(holder.innerText || holder.textContent || "").slice(0, 18000),
                    },
                });
                const parsed = parseAiJson(result.content);
                const html = sanitizeOfficeWordHtml(parsed.html || parsed.content || "");
                if (!html) throw new Error("A IA não retornou conteúdo utilizável para o Word.");
                if (mode === "append") state.wordHtml = `${state.wordHtml || ""}<hr>${html}`;
                else state.wordHtml = html;
                const suggestedName = String(parsed.title || parsed.fileName || "").trim();
                if (suggestedName && mode !== "append") state.wordFileName = suggestedName.slice(0, 120);
                localStorage.setItem("docspace_word_draft", state.wordHtml);
                localStorage.setItem("docspace_word_name", state.wordFileName || "Documento");
                state.officeAiOpen = false;
                state.officeAiPrompt = "";
                toast(mode === "append" ? "Conteúdo adicionado ao Word pela IA." : "Documento criado no Word pela IA.", "success");
                renderWordEditor();
                return;
            }

            const compactCurrent = (state.excelData || []).slice(0, 120).map((row) => (row || []).slice(0, 30));
            const result = await window.DocSpaceAI.run("office-excel", {
                prompt,
                history: [],
                context: {
                    area: "office",
                    officeTarget: "excel",
                    operation: mode,
                    currentFileName: state.excelFileName || "Planilha",
                    currentSheet: compactCurrent,
                },
            });
            const parsed = parseAiJson(result.content);
            const generated = normalizeOfficeExcelPayload(parsed);
            state.excelData = mode === "append" ? appendExcelData(state.excelData, generated) : generated;
            ensureExcelData();
            const minimumRows = Math.max(20, state.excelData.length);
            const minimumCols = Math.max(8, state.excelData[0]?.length || 1);
            state.excelData = Array.from({ length: minimumRows }, (_, row) => Array.from({ length: minimumCols }, (_, col) => String(state.excelData[row]?.[col] ?? "")));
            state.excelStyles = {};
            if (mode !== "append" && Array.isArray(parsed.columns) && parsed.columns.length) {
                parsed.columns.slice(0, minimumCols).forEach((_, col) => { state.excelStyles[excelCellKey(0, col)] = { bold: true, background: "#eef4ff" }; });
            }
            const suggestedName = String(parsed.fileName || parsed.title || "").trim();
            if (suggestedName && mode !== "append") state.excelFileName = suggestedName.slice(0, 120);
            localStorage.setItem("docspace_excel_draft", JSON.stringify(state.excelData));
            state.officeAiOpen = false;
            state.officeAiPrompt = "";
            toast(mode === "append" ? "Tabela adicionada ao Excel pela IA." : "Planilha criada no Excel pela IA.", "success");
            renderExcelEditor();
        } catch (error) {
            state.officeAiError = translateError(error);
            toast(state.officeAiError, "error");
        } finally {
            state.officeAiBusy = false;
            if (state.officeAiOpen) target === "excel" ? renderExcelEditor() : renderWordEditor();
        }
    }

    function renderWordEditor() {
        refs.content.innerHTML = `
            <section class="office-editor-shell word-editor-page">
                <div class="office-sticky-controls office-sticky-controls-word">
                <div class="office-filebar">
                    <input id="wordFileName" class="office-file-name" value="${escapeAttr(state.wordFileName || "Documento")}" placeholder="Nome do documento">
                    <span class="office-save-status" id="wordSaveStatus"><i data-lucide="cloud-check"></i> Rascunho salvo localmente</span>
                    <div class="office-file-actions">
                        <button type="button" class="secondary-button" data-word-new><i data-lucide="file-plus-2"></i> Novo</button>
                        <button type="button" class="secondary-button" data-word-import><i data-lucide="file-up"></i> Importar .docx</button>
                        <input id="wordImportInput" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden>
                        <input id="wordImageInput" type="file" accept="image/png,image/jpeg,image/webp" hidden>
                        <button type="button" class="secondary-button" data-word-print><i data-lucide="printer"></i> Imprimir</button>
                        <button type="button" class="secondary-button office-ai-inline-button" data-office-ai-open="word"><i data-lucide="sparkles"></i> Assistente IA</button>
                        <button type="button" class="secondary-button" data-word-export-pdf><i data-lucide="file-type-2"></i> Exportar PDF</button>
                        <button type="button" class="primary-button" data-word-export-docx><i data-lucide="file-down"></i> Salvar Word</button>
                    </div>
                </div>
                <div class="word-toolbar" role="toolbar" aria-label="Formatação do documento">
                    <select data-word-font title="Fonte"><option value="Arial">Arial</option><option value="Calibri">Calibri</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times New Roman</option><option value="Verdana">Verdana</option></select>
                    <select data-word-size title="Tamanho"><option value="2">10</option><option value="3" selected>12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option><option value="7">32</option></select>
                    <label class="word-color-control" title="Cor do texto"><i data-lucide="palette"></i><input type="color" value="#111111" data-word-color></label>
                    <label class="word-color-control" title="Marca-texto"><i data-lucide="highlighter"></i><input type="color" value="#fff3a3" data-word-highlight></label>
                    <span class="word-toolbar-separator"></span>
                    <button type="button" data-word-command="bold" title="Negrito"><i data-lucide="bold"></i></button>
                    <button type="button" data-word-command="italic" title="Itálico"><i data-lucide="italic"></i></button>
                    <button type="button" data-word-command="underline" title="Sublinhado"><i data-lucide="underline"></i></button>
                    <button type="button" data-word-command="strikeThrough" title="Tachado"><i data-lucide="strikethrough"></i></button>
                    <span class="word-toolbar-separator"></span>
                    <button type="button" data-word-block="h1" title="Título 1"><i data-lucide="heading-1"></i></button>
                    <button type="button" data-word-block="h2" title="Título 2"><i data-lucide="heading-2"></i></button>
                    <button type="button" data-word-block="h3" title="Título 3"><i data-lucide="heading-3"></i></button>
                    <button type="button" data-word-command="insertUnorderedList" title="Lista"><i data-lucide="list"></i></button>
                    <button type="button" data-word-command="insertOrderedList" title="Lista numerada"><i data-lucide="list-ordered"></i></button>
                    <button type="button" data-word-block="blockquote" title="Citação"><i data-lucide="quote"></i></button>
                    <span class="word-toolbar-separator"></span>
                    <button type="button" data-word-command="justifyLeft" title="Alinhar à esquerda"><i data-lucide="align-left"></i></button>
                    <button type="button" data-word-command="justifyCenter" title="Centralizar"><i data-lucide="align-center"></i></button>
                    <button type="button" data-word-command="justifyRight" title="Alinhar à direita"><i data-lucide="align-right"></i></button>
                    <button type="button" data-word-command="justifyFull" title="Justificar"><i data-lucide="align-justify"></i></button>
                    <span class="word-toolbar-separator"></span>
                    <button type="button" data-word-link title="Inserir link"><i data-lucide="link"></i></button>
                    <button type="button" data-word-command="unlink" title="Remover link"><i data-lucide="unlink"></i></button>
                    <button type="button" data-word-table title="Inserir tabela"><i data-lucide="table-2"></i></button>
                    <button type="button" data-word-image title="Inserir imagem"><i data-lucide="image-plus"></i></button>
                    <button type="button" data-word-command="insertHorizontalRule" title="Linha horizontal"><i data-lucide="minus"></i></button>
                    <button type="button" data-word-command="removeFormat" title="Limpar formatação"><i data-lucide="remove-formatting"></i></button>
                    <button type="button" data-word-page-break title="Quebra de página"><i data-lucide="between-horizontal-start"></i></button>
                    <button type="button" data-word-find title="Localizar e substituir"><i data-lucide="search-replace"></i></button>
                    <label class="word-line-control" title="Espaçamento entre linhas"><i data-lucide="rows-3"></i><select data-word-line-height><option value="1">1,0</option><option value="1.15">1,15</option><option value="1.5" selected>1,5</option><option value="2">2,0</option></select></label>
                    <span class="word-toolbar-separator"></span>
                    <label class="word-zoom-control"><i data-lucide="zoom-in"></i><select data-word-zoom><option value="75" ${state.wordZoom === 75 ? "selected" : ""}>75%</option><option value="90" ${state.wordZoom === 90 ? "selected" : ""}>90%</option><option value="100" ${state.wordZoom === 100 ? "selected" : ""}>100%</option><option value="110" ${state.wordZoom === 110 ? "selected" : ""}>110%</option><option value="125" ${state.wordZoom === 125 ? "selected" : ""}>125%</option></select></label>
                    <button type="button" data-word-command="undo" title="Desfazer"><i data-lucide="undo-2"></i></button>
                    <button type="button" data-word-command="redo" title="Refazer"><i data-lucide="redo-2"></i></button>
                </div>
                </div>
                <div class="word-editor-surface">
                    <article id="wordEditor" class="word-page" style="zoom:${Number(state.wordZoom || 100) / 100}" contenteditable="true" spellcheck="true" aria-label="Editor de documento">${state.wordHtml || "<p></p>"}</article>
                </div>
                <footer class="word-statusbar"><span id="wordCountStatus">0 palavras · 0 caracteres</span><span>Salvamento local automático</span></footer>
                ${renderOfficeAiDialog("word")}
            </section>`;
        bindWordEditor();
        initIcons();
    }

    function updateWordCount(editor) {
        const text = String(editor?.innerText || "").replace(/\s+/g, " ").trim();
        const words = text ? text.split(" ").filter(Boolean).length : 0;
        const chars = text.length;
        const status = $("#wordCountStatus");
        if (status) status.textContent = `${words} palavra${words === 1 ? "" : "s"} · ${chars} caractere${chars === 1 ? "" : "s"}`;
    }

    function selectedWordBlock(editor) {
        const selection = window.getSelection?.();
        let node = selection?.anchorNode || null;
        if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
        return node?.closest?.("p,div,li,h1,h2,h3,h4,h5,h6,blockquote,td") || editor;
    }

    function replaceWordEditorText(editor, search, replacement) {
        if (!search) return 0;
        const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        let count = 0;
        nodes.forEach((node) => {
            const parts = String(node.nodeValue || "").split(search);
            if (parts.length <= 1) return;
            count += parts.length - 1;
            node.nodeValue = parts.join(replacement);
        });
        return count;
    }

    function bindWordEditor() {
        const editor = $("#wordEditor");
        const nameInput = $("#wordFileName");
        if (!editor) return;
        document.execCommand?.("styleWithCSS", false, true);
        let saveTimer;
        const persistWordDraft = () => {
            state.wordHtml = editor.innerHTML;
            localStorage.setItem("docspace_word_draft", state.wordHtml);
            localStorage.setItem("docspace_word_name", state.wordFileName || "Documento");
            state.wordSavedAt = new Date().toISOString();
            const status = $("#wordSaveStatus");
            if (status) status.innerHTML = `<i data-lucide="cloud-check"></i> Salvo às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
            initIcons();
        };
        editor.addEventListener("input", () => { state.wordHtml = editor.innerHTML; updateWordCount(editor); window.clearTimeout(saveTimer); saveTimer = window.setTimeout(persistWordDraft, 450); });
        updateWordCount(editor);
        nameInput?.addEventListener("input", () => { state.wordFileName = nameInput.value || "Documento"; localStorage.setItem("docspace_word_name", state.wordFileName); });
        $$("[data-word-command]", refs.content).forEach((button) => button.addEventListener("click", () => {
            editor.focus();
            document.execCommand(button.dataset.wordCommand, false, null);
        }));
        $$("[data-word-block]", refs.content).forEach((button) => button.addEventListener("click", () => {
            editor.focus();
            document.execCommand("formatBlock", false, button.dataset.wordBlock);
        }));
        $("[data-word-link]")?.addEventListener("click", () => {
            const url = window.prompt("URL do link", "https://");
            if (!url) return;
            editor.focus();
            document.execCommand("createLink", false, url);
        });
        $("[data-word-font]")?.addEventListener("change", (event) => { editor.focus(); document.execCommand("fontName", false, event.target.value); });
        $("[data-word-size]")?.addEventListener("change", (event) => { editor.focus(); document.execCommand("fontSize", false, event.target.value); });
        $("[data-word-color]")?.addEventListener("input", (event) => { editor.focus(); document.execCommand("foreColor", false, event.target.value); });
        $("[data-word-highlight]")?.addEventListener("input", (event) => { editor.focus(); document.execCommand("hiliteColor", false, event.target.value); });
        $("[data-word-zoom]")?.addEventListener("change", (event) => { state.wordZoom = Number(event.target.value || 100); editor.style.zoom = String(state.wordZoom / 100); });
        $("[data-word-line-height]")?.addEventListener("change", (event) => {
            editor.focus();
            const block = selectedWordBlock(editor);
            if (block) block.style.lineHeight = String(event.target.value || "1.5");
            editor.dispatchEvent(new Event("input", { bubbles: true }));
        });
        $("[data-word-page-break]")?.addEventListener("click", () => {
            editor.focus();
            document.execCommand("insertHTML", false, '<div class="word-page-break" style="page-break-after:always;break-after:page;border-top:1px dashed #cbd5e1;margin:24px 0"><span contenteditable="false" style="font-size:10px;color:#94a3b8">Quebra de página</span></div><p><br></p>');
        });
        $("[data-word-find]")?.addEventListener("click", () => {
            const search = window.prompt("Localizar no documento:", "");
            if (!search) return;
            const replacement = window.prompt(`Substituir "${search}" por:`, "");
            if (replacement === null) return;
            const count = replaceWordEditorText(editor, search, replacement);
            editor.dispatchEvent(new Event("input", { bubbles: true }));
            toast(count ? `${count} ocorrência(s) substituída(s).` : "Texto não encontrado.", count ? "success" : "info");
        });
        $("[data-word-table]")?.addEventListener("click", () => {
            const rows = Math.max(1, Math.min(20, Number(window.prompt("Quantidade de linhas", "3") || 0)));
            const cols = Math.max(1, Math.min(12, Number(window.prompt("Quantidade de colunas", "3") || 0)));
            if (!rows || !cols) return;
            const table = `<table style="width:100%;border-collapse:collapse;margin:12px 0">${Array.from({ length: rows }, () => `<tr>${Array.from({ length: cols }, () => `<td style="border:1px solid #999;padding:7px">&nbsp;</td>`).join("")}</tr>`).join("")}</table><p></p>`;
            editor.focus(); document.execCommand("insertHTML", false, table);
        });
        $("[data-word-image]")?.addEventListener("click", () => $("#wordImageInput")?.click());
        $("#wordImageInput")?.addEventListener("change", async (event) => {
            const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
            if (file.size > 5 * 1024 * 1024) return toast("A imagem deve ter no máximo 5 MB.", "error");
            const dataUrl = await fileToDataUrl(file);
            editor.focus(); document.execCommand("insertImage", false, dataUrl);
            const images = editor.querySelectorAll("img"); const image = images[images.length - 1]; if (image) image.style.maxWidth = "100%";
        });
        $("[data-word-new]")?.addEventListener("click", () => {
            state.wordFileName = "Documento";
            state.wordHtml = "<h1>Novo documento</h1><p></p>";
            localStorage.removeItem("docspace_word_draft");
            localStorage.removeItem("docspace_word_name");
            renderWordEditor();
        });
        $("[data-word-import]")?.addEventListener("click", () => $("#wordImportInput")?.click());
        $("#wordImportInput")?.addEventListener("change", async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            try {
                if (!window.mammoth?.convertToHtml) throw new Error("Biblioteca de importação Word não carregada.");
                const result = await window.mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
                state.wordHtml = result.value || "<p></p>";
                state.wordFileName = file.name.replace(/\.docx?$/i, "") || "Documento";
                renderWordEditor();
                toast("Documento importado.", "success");
            } catch (error) { toast(translateError(error), "error"); }
        });
        $("[data-word-export-docx]")?.addEventListener("click", async () => {
            try {
                const blob = await buildWordEditorBlob();
                const name = sanitizeDownloadName(state.wordFileName || "Documento", "documento");
                saveBlob(blob, `${name}.docx`);
                toast("Documento Word exportado.", "success");
            } catch (error) { toast(translateError(error), "error"); }
        });
        $("[data-word-export-pdf]")?.addEventListener("click", async (event) => {
            const button = event.currentTarget;
            try {
                button.disabled = true;
                const blob = await buildWordEditorBlob();
                const name = sanitizeDownloadName(state.wordFileName || "Documento", "documento");
                const response = await apiRequest("/api/ai/export-pdf", { method: "POST", body: { docxBase64: await blobToBase64(blob, true), fileName: `${name}.docx` } });
                if (!response?.pdfBase64) throw new Error("O servidor não retornou o PDF.");
                downloadBase64(response.pdfBase64, response.fileName || `${name}.pdf`, "application/pdf");
                toast("PDF exportado.", "success");
            } catch (error) { toast(translateError(error), "error"); }
            finally { button.disabled = false; }
        });
        $("[data-word-print]")?.addEventListener("click", () => {
            const printWindow = window.open("", "_blank", "width=900,height=1000");
            if (!printWindow) return toast("O navegador bloqueou a janela de impressão.", "error");
            printWindow.document.write(wordExportHtml(editor.innerHTML).replace("</style>", "@page{size:A4;margin:2cm}body{max-width:17cm;margin:0 auto}</style>"));
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 250);
        });
    }

    function excelColName(index) {
        let value = Number(index) + 1;
        let name = "";
        while (value > 0) {
            value -= 1;
            name = String.fromCharCode(65 + (value % 26)) + name;
            value = Math.floor(value / 26);
        }
        return name;
    }


    function excelCellKey(row, col) { return `${row}:${col}`; }

    function excelCellReference(row, col) { return `${excelColName(col)}${row + 1}`; }

    function excelReferenceToIndex(reference) {
        const match = /^([A-Z]+)(\d+)$/i.exec(String(reference || "").trim());
        if (!match) return null;
        let col = 0;
        for (const char of match[1].toUpperCase()) col = col * 26 + char.charCodeAt(0) - 64;
        return { row: Number(match[2]) - 1, col: col - 1 };
    }

    function excelNumericValue(row, col, visited = new Set()) {
        const key = excelCellKey(row, col);
        if (visited.has(key)) return 0;
        visited.add(key);
        const raw = String(state.excelData?.[row]?.[col] ?? "").trim();
        if (raw.startsWith("=")) return Number(evaluateExcelFormula(raw, visited)) || 0;
        const normalized = raw.replace(/\./g, "").replace(",", ".").replace(/[^0-9+\-.]/g, "");
        return Number(normalized) || 0;
    }

    function excelRangeValues(startRef, endRef, visited = new Set()) {
        const start = excelReferenceToIndex(startRef);
        const end = excelReferenceToIndex(endRef || startRef);
        if (!start || !end) return [];
        const values = [];
        for (let row = Math.min(start.row, end.row); row <= Math.max(start.row, end.row); row += 1) {
            for (let col = Math.min(start.col, end.col); col <= Math.max(start.col, end.col); col += 1) values.push(excelNumericValue(row, col, new Set(visited)));
        }
        return values;
    }

    function evaluateExcelFormula(formula, visited = new Set()) {
        let expression = String(formula || "").trim().replace(/^=/, "");
        expression = expression.replace(/\b(SUM|SOMA|AVERAGE|MEDIA|MÉDIA|MIN|MAX|COUNT|CONTAR)\s*\(\s*([A-Z]+\d+)(?::([A-Z]+\d+))?\s*\)/gi, (_, fn, start, end) => {
            const values = excelRangeValues(start, end || start, visited);
            const name = fn.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            if (!values.length) return "0";
            if (["AVERAGE", "MEDIA"].includes(name)) return String(values.reduce((a, b) => a + b, 0) / values.length);
            if (name === "MIN") return String(Math.min(...values));
            if (name === "MAX") return String(Math.max(...values));
            if (["COUNT", "CONTAR"].includes(name)) return String(values.filter((value) => Number.isFinite(Number(value))).length);
            return String(values.reduce((a, b) => a + b, 0));
        });
        expression = expression.replace(/\b([A-Z]+\d+)\b/gi, (reference) => {
            const index = excelReferenceToIndex(reference);
            return index ? String(excelNumericValue(index.row, index.col, new Set(visited))) : "0";
        });
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) return "#ERRO";
        try {
            const value = Function(`"use strict"; return (${expression});`)();
            if (!Number.isFinite(Number(value))) return "#ERRO";
            return Math.round(Number(value) * 100000000) / 100000000;
        } catch (_) { return "#ERRO"; }
    }

    function excelDisplayValue(raw) {
        const value = String(raw ?? "");
        return value.trim().startsWith("=") ? String(evaluateExcelFormula(value)) : value;
    }

    function excelStyleAttribute(row, col) {
        const style = state.excelStyles[excelCellKey(row, col)] || {};
        const declarations = [];
        if (style.bold) declarations.push("font-weight:700");
        if (style.italic) declarations.push("font-style:italic");
        if (style.align) declarations.push(`text-align:${style.align}`);
        if (style.background) declarations.push(`background:${style.background}`);
        if (style.color) declarations.push(`color:${style.color}`);
        return declarations.join(";");
    }

    function createExcelSheet() {
        const sheet = {};
        const rows = state.excelData.length;
        const cols = state.excelData[0]?.length || 1;
        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
                const raw = String(state.excelData[row][col] ?? "");
                if (!raw) continue;
                const address = window.XLSX.utils.encode_cell({ r: row, c: col });
                if (raw.startsWith("=")) sheet[address] = { t: "n", f: raw.slice(1), v: Number(evaluateExcelFormula(raw)) || 0 };
                else if (/^-?\d+(?:[.,]\d+)?$/.test(raw.trim())) sheet[address] = { t: "n", v: Number(raw.replace(",", ".")) };
                else sheet[address] = { t: "s", v: raw };
            }
        }
        sheet["!ref"] = window.XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows - 1, c: cols - 1 } });
        sheet["!cols"] = Array.from({ length: cols }, () => ({ wch: 16 }));
        return sheet;
    }

    function importExcelSheetData(sheet) {
        const range = window.XLSX.utils.decode_range(sheet["!ref"] || "A1:H20");
        const rows = Math.max(20, range.e.r + 1);
        const cols = Math.max(8, range.e.c + 1);
        return Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => {
            const cell = sheet[window.XLSX.utils.encode_cell({ r: row, c: col })];
            if (!cell) return "";
            if (cell.f) return `=${cell.f}`;
            return String(cell.v ?? "");
        }));
    }

    function ensureExcelData() {
        if (!Array.isArray(state.excelData) || !state.excelData.length) state.excelData = Array.from({ length: 20 }, () => Array.from({ length: 8 }, () => ""));
        const cols = Math.max(1, ...state.excelData.map((row) => Array.isArray(row) ? row.length : 0));
        state.excelData = state.excelData.map((row) => {
            const next = Array.isArray(row) ? row.map((value) => String(value ?? "")) : [];
            while (next.length < cols) next.push("");
            return next;
        });
    }

    function excelTableHtml() {
        ensureExcelData();
        const cols = state.excelData[0].length;
        const selected = state.excelSelectedCell || { row: 0, col: 0 };
        return `<table class="excel-grid" style="zoom:${Number(state.excelZoom || 100) / 100}"><thead><tr><th class="excel-corner"></th>${Array.from({ length: cols }, (_, c) => `<th>${excelColName(c)}</th>`).join("")}</tr></thead><tbody>${state.excelData.map((row, r) => `<tr><th>${r + 1}</th>${row.map((cell, c) => `<td class="${selected.row === r && selected.col === c ? "is-selected" : ""}" style="${escapeAttr(excelStyleAttribute(r, c))}"><input value="${escapeAttr(excelDisplayValue(cell))}" data-excel-raw="${escapeAttr(cell)}" data-excel-row="${r}" data-excel-col="${c}" aria-label="Célula ${excelColName(c)}${r + 1}" title="${escapeAttr(String(cell).startsWith("=") ? `${cell} = ${excelDisplayValue(cell)}` : cell)}"></td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }

    function renderExcelEditor() {
        ensureExcelData();
        const rows = state.excelData.length;
        const cols = state.excelData[0].length;
        const filled = state.excelData.flat().filter((cell) => String(cell || "").trim()).length;
        refs.content.innerHTML = `
            <section class="office-editor-shell excel-editor-page">
                <div class="office-sticky-controls office-sticky-controls-excel">
                <div class="office-filebar excel-filebar">
                    <input id="excelFileName" class="office-file-name" value="${escapeAttr(state.excelFileName || "Planilha")}" placeholder="Nome da planilha">
                    <div class="office-file-actions">
                        <button type="button" class="secondary-button" data-excel-import><i data-lucide="file-up"></i> Importar</button>
                        <input id="excelImportInput" type="file" accept=".xlsx,.xls,.csv" hidden>
                        <button type="button" class="primary-button" data-excel-export-xlsx><i data-lucide="file-down"></i> Excel (.xlsx)</button>
                        <button type="button" class="secondary-button" data-excel-export-csv><i data-lucide="file-down"></i> CSV</button>
                        <button type="button" class="ghost-button" data-excel-print><i data-lucide="printer"></i> Imprimir</button>
                        <button type="button" class="secondary-button office-ai-inline-button" data-office-ai-open="excel"><i data-lucide="sparkles"></i> Assistente IA</button>
                        <span class="office-divider"></span>
                        <button type="button" class="ghost-button" data-excel-add-row><i data-lucide="plus"></i> Linha</button>
                        <button type="button" class="ghost-button" data-excel-add-col><i data-lucide="plus"></i> Coluna</button>
                        <button type="button" class="ghost-button" data-excel-remove-row><i data-lucide="trash-2"></i> Linha</button>
                        <button type="button" class="ghost-button" data-excel-remove-col><i data-lucide="trash-2"></i> Coluna</button>
                        <button type="button" class="ghost-button office-danger" data-excel-clear><i data-lucide="trash-2"></i> Limpar</button>
                    </div>
                    <span class="excel-stats">${rows}×${cols} · ${filled} preenchidas</span>
                </div>
                <div class="excel-toolbar">
                    <span id="excelCellName" class="excel-cell-name">${excelCellReference(state.excelSelectedCell.row, state.excelSelectedCell.col)}</span>
                    <span class="excel-fx">fx</span>
                    <input id="excelFormulaInput" class="excel-formula-input" value="${escapeAttr(state.excelData[state.excelSelectedCell.row]?.[state.excelSelectedCell.col] || "")}" placeholder="Digite um valor ou fórmula, ex.: =SUM(A1:A5)">
                    <button type="button" data-excel-format="bold" title="Negrito"><i data-lucide="bold"></i></button>
                    <button type="button" data-excel-format="italic" title="Itálico"><i data-lucide="italic"></i></button>
                    <button type="button" data-excel-align="left" title="Alinhar à esquerda"><i data-lucide="align-left"></i></button>
                    <button type="button" data-excel-align="center" title="Centralizar"><i data-lucide="align-center"></i></button>
                    <button type="button" data-excel-align="right" title="Alinhar à direita"><i data-lucide="align-right"></i></button>
                    <button type="button" data-excel-sum title="Inserir soma"><i data-lucide="sigma"></i></button>
                    <button type="button" data-excel-sort="asc" title="Ordenar coluna crescente"><i data-lucide="arrow-down-a-z"></i></button>
                    <button type="button" data-excel-sort="desc" title="Ordenar coluna decrescente"><i data-lucide="arrow-down-z-a"></i></button>
                    <button type="button" data-excel-insert-row title="Inserir linha acima"><i data-lucide="rows-3"></i></button>
                    <button type="button" data-excel-duplicate-row title="Duplicar linha selecionada"><i data-lucide="copy-plus"></i></button>
                    <button type="button" data-excel-clear-cell title="Limpar célula"><i data-lucide="eraser"></i></button>
                    <label class="excel-color-control" title="Cor do texto"><input type="color" value="#111827" data-excel-color></label>
                    <label class="excel-color-control" title="Cor de fundo"><input type="color" value="#fff4bd" data-excel-background></label>
                    <label class="excel-zoom-control">Zoom <select data-excel-zoom><option value="80" ${state.excelZoom === 80 ? "selected" : ""}>80%</option><option value="100" ${state.excelZoom === 100 ? "selected" : ""}>100%</option><option value="120" ${state.excelZoom === 120 ? "selected" : ""}>120%</option></select></label>
                </div>
                </div>
                <div class="excel-grid-wrap">${excelTableHtml()}</div>
                <div class="excel-hint"><i data-lucide="sparkles"></i><span>Dica: o <strong>Assistente Excel</strong> cria e aplica tabelas, fórmulas e estruturas diretamente nesta planilha.</span></div>
                ${renderOfficeAiDialog("excel")}
            </section>`;
        bindExcelEditor();
        initIcons();
    }

    function bindExcelEditor() {
        $("#excelFileName")?.addEventListener("input", (event) => { state.excelFileName = event.target.value || "Planilha"; });
        const grid = refs.content.querySelector(".excel-grid");
        grid?.addEventListener("focusin", (event) => {
            const input = event.target.closest("[data-excel-row]"); if (!input) return;
            const row = Number(input.dataset.excelRow); const col = Number(input.dataset.excelCol);
            state.excelSelectedCell = { row, col };
            input.value = String(state.excelData[row]?.[col] ?? "");
            $("#excelCellName").textContent = excelCellReference(row, col);
            $("#excelFormulaInput").value = input.value;
            grid.querySelectorAll("td.is-selected").forEach((cell) => cell.classList.remove("is-selected"));
            input.closest("td")?.classList.add("is-selected");
        });
        grid?.addEventListener("input", (event) => {
            const input = event.target.closest("[data-excel-row]"); if (!input) return;
            const row = Number(input.dataset.excelRow); const col = Number(input.dataset.excelCol);
            if (state.excelData[row]) state.excelData[row][col] = input.value;
            input.dataset.excelRaw = input.value;
            $("#excelFormulaInput").value = input.value;
            localStorage.setItem("docspace_excel_draft", JSON.stringify(state.excelData));
        });
        grid?.addEventListener("focusout", (event) => {
            const input = event.target.closest("[data-excel-row]"); if (!input) return;
            const row = Number(input.dataset.excelRow); const col = Number(input.dataset.excelCol);
            input.value = excelDisplayValue(state.excelData[row]?.[col] || "");
        });
        $("#excelFormulaInput")?.addEventListener("input", (event) => {
            const { row, col } = state.excelSelectedCell;
            state.excelData[row][col] = event.target.value;
            const cell = grid?.querySelector(`[data-excel-row="${row}"][data-excel-col="${col}"]`);
            if (cell) cell.value = event.target.value;
        });
        $("#excelFormulaInput")?.addEventListener("change", () => renderExcelEditor());
        const mutateSelectedStyle = (patch) => {
            const { row, col } = state.excelSelectedCell;
            const key = excelCellKey(row, col);
            state.excelStyles[key] = { ...(state.excelStyles[key] || {}), ...patch };
            renderExcelEditor();
        };
        $$('[data-excel-format]', refs.content).forEach((button) => button.addEventListener("click", () => {
            const key = excelCellKey(state.excelSelectedCell.row, state.excelSelectedCell.col);
            const current = state.excelStyles[key] || {};
            mutateSelectedStyle({ [button.dataset.excelFormat]: !current[button.dataset.excelFormat] });
        }));
        $$('[data-excel-align]', refs.content).forEach((button) => button.addEventListener("click", () => mutateSelectedStyle({ align: button.dataset.excelAlign })));
        $("[data-excel-background]")?.addEventListener("input", (event) => mutateSelectedStyle({ background: event.target.value }));
        $("[data-excel-color]")?.addEventListener("input", (event) => mutateSelectedStyle({ color: event.target.value }));
        $$('[data-excel-sort]', refs.content).forEach((button) => button.addEventListener("click", () => {
            const col = state.excelSelectedCell.col;
            const direction = button.dataset.excelSort === "desc" ? -1 : 1;
            state.excelData.sort((a, b) => String(a[col] ?? "").localeCompare(String(b[col] ?? ""), "pt-BR", { numeric: true, sensitivity: "base" }) * direction);
            renderExcelEditor();
        }));
        $("[data-excel-insert-row]")?.addEventListener("click", () => {
            const row = Math.max(0, state.excelSelectedCell.row);
            state.excelData.splice(row, 0, Array.from({ length: state.excelData[0].length }, () => ""));
            renderExcelEditor();
        });
        $("[data-excel-duplicate-row]")?.addEventListener("click", () => {
            const row = Math.max(0, state.excelSelectedCell.row);
            state.excelData.splice(row + 1, 0, [...state.excelData[row]]);
            renderExcelEditor();
        });
        $("[data-excel-clear-cell]")?.addEventListener("click", () => {
            const { row, col } = state.excelSelectedCell;
            state.excelData[row][col] = "";
            renderExcelEditor();
        });
        $("[data-excel-zoom]")?.addEventListener("change", (event) => { state.excelZoom = Number(event.target.value || 100); renderExcelEditor(); });
        $("[data-excel-sum]")?.addEventListener("click", () => {
            const { row, col } = state.excelSelectedCell;
            state.excelData[row][col] = row > 0 ? `=SUM(${excelCellReference(0, col)}:${excelCellReference(row - 1, col)})` : "=SUM(A1:A1)";
            renderExcelEditor();
        });
        $("[data-excel-import]")?.addEventListener("click", () => $("#excelImportInput")?.click());
        $("#excelImportInput")?.addEventListener("change", async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            try {
                if (!window.XLSX) throw new Error("Biblioteca Excel não carregada.");
                const workbook = window.XLSX.read(await file.arrayBuffer(), { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                state.excelData = importExcelSheetData(sheet);
                state.excelFileName = file.name.replace(/\.(xlsx|xls|csv)$/i, "") || "Planilha";
                renderExcelEditor();
                toast("Planilha importada.", "success");
            } catch (error) { toast(translateError(error), "error"); }
        });
        $("[data-excel-export-xlsx]")?.addEventListener("click", () => {
            try {
                if (!window.XLSX) throw new Error("Biblioteca Excel não carregada.");
                const sheet = createExcelSheet();
                const workbook = window.XLSX.utils.book_new();
                window.XLSX.utils.book_append_sheet(workbook, sheet, "Planilha1");
                const bytes = window.XLSX.write(workbook, { type: "array", bookType: "xlsx" });
                saveBlob(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${sanitizeDownloadName(state.excelFileName, "planilha")}.xlsx`);
                toast("Excel exportado.", "success");
            } catch (error) { toast(translateError(error), "error"); }
        });
        $("[data-excel-export-csv]")?.addEventListener("click", () => {
            try {
                if (!window.XLSX) throw new Error("Biblioteca Excel não carregada.");
                const csv = window.XLSX.utils.sheet_to_csv(window.XLSX.utils.aoa_to_sheet(state.excelData.map((row) => row.map(excelDisplayValue))));
                saveBlob(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), `${sanitizeDownloadName(state.excelFileName, "planilha")}.csv`);
                toast("CSV exportado.", "success");
            } catch (error) { toast(translateError(error), "error"); }
        });
        $("[data-excel-add-row]")?.addEventListener("click", () => { state.excelData.push(Array.from({ length: state.excelData[0].length }, () => "")); renderExcelEditor(); });
        $("[data-excel-add-col]")?.addEventListener("click", () => { state.excelData.forEach((row) => row.push("")); renderExcelEditor(); });
        $("[data-excel-remove-row]")?.addEventListener("click", () => { if (state.excelData.length > 1) state.excelData.pop(); renderExcelEditor(); });
        $("[data-excel-remove-col]")?.addEventListener("click", () => { if (state.excelData[0].length > 1) state.excelData.forEach((row) => row.pop()); renderExcelEditor(); });
        $("[data-excel-clear]")?.addEventListener("click", () => {
            if (!window.confirm("Limpar toda a planilha?")) return;
            state.excelFileName = "Planilha";
            state.excelData = Array.from({ length: 20 }, () => Array.from({ length: 8 }, () => ""));
            renderExcelEditor();
        });
        $("[data-excel-print]")?.addEventListener("click", () => window.print());
    }

    async function prepareProfileAvatar(file) {
        if (!file.type?.startsWith("image/")) throw new Error("Escolha uma imagem JPG, PNG ou WEBP.");
        if (file.size > 8 * 1024 * 1024) throw new Error("A imagem original deve ter no máximo 8 MB.");
        const dataUrl = await fileToDataUrl(file);
        const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Não foi possível abrir a imagem."));
            img.src = dataUrl;
        });
        const size = 420;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const context = canvas.getContext("2d");
        const scale = Math.max(size / image.width, size / image.height);
        const width = image.width * scale, height = image.height * scale;
        context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        return canvas.toDataURL("image/jpeg", 0.82);
    }

    async function updateProfileAvatar(avatarDataUrl) {
        const result = await apiRequest("/api/profile/avatar", { method: "PUT", body: { avatarDataUrl } });
        if (result.user) state.user = result.user;
        updateUserChrome();
        renderProfile();
        initIcons();
        toast(result.message || "Foto de perfil atualizada.", "success");
    }

    function renderProfile() {
        const user = state.user || {};
        const docsRemaining = getTotalRemainingDocuments();
        const pdfRemaining = getTotalRemainingPdf();
        refs.content.innerHTML = `
            <div class="profile-layout">
                <article class="panel profile-card">
                    <div class="profile-identity profile-identity-editable">
                        <div class="profile-avatar-editor">
                            ${user.avatarDataUrl || user.avatar_data_url ? `<img class="profile-avatar profile-avatar-image" src="${escapeAttr(user.avatarDataUrl || user.avatar_data_url)}" alt="Foto de perfil">` : `<span class="profile-avatar">${escapeHtml(initials(user.name || user.email || "DS"))}</span>`}
                            <button type="button" class="profile-avatar-action" data-profile-avatar-select aria-label="Alterar foto"><i data-lucide="camera"></i></button>
                            <input id="profileAvatarInput" type="file" accept="image/jpeg,image/png,image/webp" hidden>
                        </div>
                        <div class="profile-identity-copy">
                            <p class="eyebrow">Minha conta</p>
                            <h2>${escapeHtml(user.name || "Usuário")}</h2>
                            <p>${escapeHtml(user.email || "E-mail não informado")}</p>
                            <div class="profile-photo-actions">
                                <button type="button" class="secondary-button" data-profile-avatar-select>Escolher foto</button>
                                ${(user.avatarDataUrl || user.avatar_data_url) ? `<button type="button" class="ghost-button" data-profile-avatar-remove>Remover foto</button>` : ""}
                            </div>
                            <small class="profile-photo-hint">JPG, PNG ou WEBP. A imagem é salva na sua conta.</small>
                        </div>
                    </div>
                    <div class="profile-status-grid">
                        <div><small>Plano atual</small><strong>${escapeHtml(displayPlanLabel(user))}</strong></div>
                        <div><small>Status do acesso</small><strong class="status-${escapeAttr(String(user.status || "active").toLowerCase())}">${escapeHtml(accessStatusLabel(user.status))}</strong></div>
                        <div><small>Vencimento</small><strong>${formatDate(user.expiresAt || user.expires_at)}</strong></div>
                        <div><small>Documentos disponíveis</small><strong>${state.documentUsage?.unlimited || isAdmin() ? "∞" : docsRemaining}</strong></div>
                        <div><small>Ferramentas PDF</small><strong>${state.pdfToolUsage?.unlimited || isAdmin() ? "∞" : pdfRemaining}</strong></div>
                    </div>
                </article>
                <article class="panel">
                    <p class="eyebrow">Plano e acesso</p>
                    <h2>Renovar ou alterar plano</h2>
                    <p>Escolha o plano adequado para renovar ou alterar o seu acesso.</p>
                    <div class="grid plan-grid">${PAYMENT_PLANS.map((plan) => `<article class="document-card plan-card"><h3>${escapeHtml(plan.label)}</h3><p>${escapeHtml(plan.price)}</p><button class="primary-button" data-create-pix="${plan.id}">Escolher plano</button></article>`).join("")}</div>
                    <div id="billingResult" class="qr-box" style="margin-top:18px"></div>
                </article>
                <article class="panel profile-actions">
                    <div><p class="eyebrow">Segurança</p><h2>Controle do acesso</h2><p>Para alterar senha, bloquear a conta ou corrigir seus dados, fale com o administrador.</p></div>
                    <button class="secondary-button" data-goto="support">Abrir atendimento</button>
                </article>
            </div>`;
    }

    function displayPlanLabel(user) {
        const planId = String(user?.plan || "").toLowerCase();
        if (!isAdmin() && ["test3min", "test10c"].includes(planId)) return "Acesso temporário";
        return user?.planLabel || user?.plan_label || user?.plan || "Não informado";
    }

    function accessStatusLabel(status) {
        const key = String(status || "active").toLowerCase();
        if (key === "blocked") return "Bloqueado";
        if (key === "expired") return "Expirado";
        return "Ativo";
    }




    function updateConditionalDocumentFields(form) {
        if (!form || form.dataset.documentId !== "comodato") return;

        const conjuge = (form.querySelector('[name="possui_conjuge"]')?.value || "nao") === "sim";
        const obito = (form.querySelector('[name="possui_obito"]')?.value || "nao") === "sim";

        const shouldShow = (name) => {
            const key = String(name || "");
            const isConjuge = key.includes("conjuge");
            const isObito =
                key.includes("falecido") ||
                key.includes("obito") ||
                key.includes("falecimento") ||
                key.includes("representante") ||
                key.includes("parentesco");

            if (isConjuge && !conjuge) return false;
            if (isObito && !obito) return false;
            return true;
        };

        form.querySelectorAll("[data-field-name]").forEach((field) => {
            const wrapper = field.closest(".field");
            if (!wrapper) return;

            const visible = shouldShow(field.dataset.fieldName);
            wrapper.classList.toggle("is-conditional-hidden", !visible);
            wrapper.hidden = !visible;

            field.disabled = !visible;
            if (!visible && "value" in field) field.value = "";
        });
    }


    function renderDocuments() {
        const filtered = getFilteredDocs();
        refs.content.innerHTML = `
            <article class="panel">
                <div class="library-toolbar">
                    <div class="library-summary">
                        <span class="library-summary-icon"><i data-lucide="library-big"></i></span>
                        <div><p class="section-label">Biblioteca</p><h2>Modelos disponíveis</h2><p>Selecione um documento para abrir o preenchimento guiado.</p></div>
                    </div>
                    <label class="field"><span>Pesquisar modelo</span><input id="documentSearchZero" class="search-input" type="search" placeholder="Digite o nome do documento..." value="${escapeHtml(state.query)}"></label>
                </div>
                <div class="library-filter-row">
                    <div class="chip-row">${CATEGORIES.map((cat) => `<button data-category="${cat.id}" class="${state.category === cat.id ? "is-active" : ""}">${escapeHtml(cat.label)}</button>`).join("")}</div>
                    <span class="library-count">${filtered.length} modelo(s) encontrado(s)</span>
                </div>
            </article>
            <div class="document-grid">${filtered.length ? filtered.map(docCard).join("") : `<article class="panel"><p class="message">Nenhum modelo encontrado para esta pesquisa.</p></article>`}</div>
            ${state.activeDocId ? renderDocumentForm(DOC_MAP.get(state.activeDocId)) : ""}
        `;
        document.body.classList.toggle("modal-open", Boolean(state.activeDocId));
        if (state.activeDocId) {
            setTimeout(() => {
                const form = $("#documentGenerateForm");
                if (form) window.DocSpaceProduct?.onDocumentFormReady?.(form);
                if (state.pendingFormData) {
                    window.DocSpaceProduct?.applyDataToForm?.(form, state.pendingFormData);
                    if (Number.isInteger(state.pendingFormStep)) {
                        form.dataset.currentStep = String(state.pendingFormStep);
                        updateDocumentWizard(form);
                    }
                    state.pendingFormData = null;
                    state.pendingFormStep = null;
                }
                applyCurrentSignatureDateToForm(form, DOC_MAP.get(state.activeDocId));
                updateConditionalDocumentFields(form);
                window.DocSpaceProduct?.injectSignatureUi?.();
                $(".document-modal-close")?.focus();
            }, 0);
        }
        initIcons();
    }

    function docCard(doc) {
        const quota = getDocQuota(doc.id);
        const blocked = quota.blocked;
        const remaining = quota.remaining;
        return `<article class="document-card">
            <button data-doc-open="${escapeAttr(doc.id)}" ${blocked ? 'aria-describedby="documentBlockedHint"' : ''}>
                <div class="document-card-head">
                    <span class="document-card-icon"><i data-lucide="file-text"></i></span>
                    <span class="document-card-arrow"><i data-lucide="arrow-up-right"></i></span>
                </div>
                <div class="document-card-body">
                    <span class="badge">${escapeHtml(categoryLabel(doc.category))}</span>
                    <h3>${escapeHtml(doc.title)}</h3>
                    <p>${escapeHtml(doc.description || "Modelo pronto para preenchimento guiado.")}</p>
                </div>
                <div class="document-card-footer">
                    <div class="card-meta">
                        <span class="badge ${blocked ? "warn" : ""}">${state.documentUsage?.unlimited ? "Ilimitado" : blocked ? "Sem saldo" : `Saldo geral: ${remaining}`}</span>
                        <span class="badge">${countDocumentFields(doc)} campos</span>
                    </div>
                    <span class="document-open-label">Preencher <i data-lucide="chevron-right"></i></span>
                </div>
            </button>
        </article>`;
    }

    function renderDocumentForm(doc) {
        if (!doc) return "";
        const steps = buildDocumentSteps(doc);
        return `<div class="document-modal-overlay" data-doc-modal-backdrop>
            <section class="document-modal" id="documentFormCard" role="dialog" aria-modal="true" aria-labelledby="documentModalTitle">
                <header class="document-modal-header">
                    <div class="document-modal-header-title">
                        <span class="document-modal-title-icon"><i data-lucide="file-pen-line"></i></span>
                        <div><h2 id="documentModalTitle">${escapeHtml(doc.title)}</h2><p>${escapeHtml(doc.description || "Preencha os campos e gere o documento.")}</p></div>
                    </div>
                    <button type="button" class="document-modal-close" data-close-doc aria-label="Fechar">×</button>
                </header>
                <div class="document-modal-body">
                    <form id="documentGenerateForm" data-document-id="${escapeAttr(doc.id)}" data-current-step="0" novalidate>
                        <div class="wizard-shell">
                            <aside class="wizard-rail">
                                <div class="wizard-rail-head"><h3>Etapas do documento</h3><p>Preencha e avance até a revisão.</p></div>
                                <ol class="wizard-steps">
                                    ${steps.map((step, index) => `<li class="${index === 0 ? "is-active" : ""}" data-step-indicator="${index}"><b>${index + 1}</b><span>${escapeHtml(step.title)}</span></li>`).join("")}
                                </ol>
                            </aside>
                            <div class="wizard-main">
                                ${steps.map((step, index) => renderWizardStep(step, index, steps.length)).join("")}
                            </div>
                        </div>
                    </form>
                    <section id="documentPdfPreview" class="pdf-preview-panel is-hidden" aria-live="polite">
                        <div class="pdf-preview-head">
                            <div><p class="eyebrow">Pré-visualização</p><h3 id="documentPdfPreviewTitle">PDF gerado</h3><p id="documentPdfPreviewName" class="pdf-preview-name"></p></div>
                            <div class="pdf-preview-actions">
                                <button type="button" class="secondary-button" data-pdf-preview-download>Baixar PDF</button>
                                <button type="button" class="secondary-button" data-pdf-preview-open>Abrir em nova aba</button>
                                <button type="button" class="ghost-button" data-pdf-preview-close>Ocultar</button>
                            </div>
                        </div>
                        <div class="pdf-preview-frame-wrap"><iframe id="documentPdfPreviewFrame" class="pdf-preview-frame" title="Pré-visualização do PDF gerado"></iframe></div>
                        <p class="pdf-preview-fallback is-hidden" id="documentPdfPreviewFallback">Seu navegador não conseguiu exibir o PDF. Use os botões de download ou abertura.</p>
                    </section>
                </div>
            </section>
        </div>`;
    }

    function renderWizardStep(step, index, total) {
        const isLast = index === total - 1;
        const isFirst = index === 0;
        return `<section class="wizard-step ${isFirst ? "is-active" : ""}" data-step-panel="${index}">
            <div class="step-head">
                <div><p class="eyebrow">Preenchimento</p><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.description || "Preencha esta parte e continue.")}</p></div>
                <span class="step-counter">Etapa ${index + 1} de ${total}</span>
            </div>
            <div class="form-grid">
                ${step.items.length ? step.items.map(renderWizardItem).join("") : `<div class="summary-box field wide">Revise os dados de cada parte. Se estiver tudo certo, gere o Word ou o PDF.</div>`}
                ${isLast ? `
                    <div class="field wide">
                        <p id="documentFormMessage" class="message"></p>
                        <div id="documentGenerateProgress" class="generate-progress is-hidden" aria-live="polite">
                            <div class="generate-progress-head">
                                <strong id="documentGenerateProgressLabel">Gerando documento...</strong>
                                <span id="documentGenerateProgressPct">0%</span>
                            </div>
                            <div class="generate-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                                <div id="documentGenerateProgressBar" class="generate-progress-bar"></div>
                            </div>
                            <p id="documentGenerateProgressHint" class="generate-progress-hint">Aguarde — o PDF costuma levar alguns segundos.</p>
                        </div>
                    </div>
                ` : ""}
                <div class="wizard-actions">
                    <button class="ghost-button" type="button" data-close-doc>Fechar</button>
                    <div class="right">
                        ${!isFirst ? `<button class="secondary-button" type="button" data-doc-step-prev>Voltar</button>` : ""}
                        ${!isLast ? `<button class="primary-button" type="button" data-doc-step-next>Próximo</button>` : `
                            <button class="primary-button" type="submit" data-generate-type="docx">Gerar Word</button>
                            <button class="secondary-button" type="submit" data-generate-type="pdf">Gerar PDF protegido</button>
                        `}
                    </div>
                </div>
            </div>
        </section>`;
    }

    function renderWizardItem(item) {
        if (item.kind === "choice") return renderChoiceField(item.choice);
        return renderField(item.field || item);
    }

    function renderChoiceField(choice) {
        return `<label class="field">
            <span>${escapeHtml(choice.label)}</span>
            <select name="${escapeAttr(choice.name)}" data-field-name="${escapeAttr(choice.name)}" autocomplete="off">${choice.options.map((option) => `<option value="${escapeAttr(option.value)}">${escapeHtml(option.label)}</option>`).join("")}</select>
        </label>`;
    }


    const SIMPLIFIED_SELECT_OPTIONS = {
        estado_civil: [
            ["", "Selecione o estado civil"],
            ["solteiro(a)", "Solteiro(a)"],
            ["casado(a)", "Casado(a)"],
            ["divorciado(a)", "Divorciado(a)"],
            ["separado(a)", "Separado(a)"],
            ["viúvo(a)", "Viúvo(a)"],
            ["união estável", "União estável"],
        ],
        mes: [
            ["", "Selecione o mês"],
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
        ],
        uf: [
            ["", "UF"],
            ["AC", "AC"], ["AL", "AL"], ["AP", "AP"], ["AM", "AM"], ["BA", "BA"], ["CE", "CE"],
            ["DF", "DF"], ["ES", "ES"], ["GO", "GO"], ["MA", "MA"], ["MT", "MT"], ["MS", "MS"],
            ["MG", "MG"], ["PA", "PA"], ["PB", "PB"], ["PR", "PR"], ["PE", "PE"], ["PI", "PI"],
            ["RJ", "RJ"], ["RN", "RN"], ["RS", "RS"], ["RO", "RO"], ["RR", "RR"], ["SC", "SC"],
            ["SP", "SP"], ["SE", "SE"], ["TO", "TO"],
        ],
        nacionalidade: [
            ["", "Selecione"],
            ["brasileiro(a)", "Brasileiro(a)"],
            ["estrangeiro(a)", "Estrangeiro(a)"],
        ],
    };

    const SIMPLIFIED_DATALIST_OPTIONS = {
        profissao: ["agricultor(a)", "lavrador(a)", "produtor(a) rural", "trabalhador(a) rural", "autônomo(a)", "aposentado(a)", "comerciante", "servidor(a) público(a)", "estudante", "do lar"],
        orgao: ["INSS", "Banco do Brasil", "Caixa Econômica Federal", "Cartório", "Prefeitura Municipal", "Receita Federal", "Secretaria de Agricultura"],
        documento: ["RG", "CPF", "CNH", "CTPS", "Certidão", "Comprovante de residência", "Contrato", "Procuração"],
    };

    function getSimplifiedSelectType(name, label) {
        const key = String(name || "").toLowerCase();
        const text = `${key} ${String(label || "").toLowerCase()}`;
        if (key.includes("estado_civil") || text.includes("estado civil")) return "estado_civil";
        if (key === "mes" || key.endsWith("_mes") || text.includes(" mês") || text.trim() === "mês") return "mes";
        if (key === "uf" || key.endsWith("_uf") || text.includes(" uf") || text.includes("estado/uf")) return "uf";
        if (key.includes("nacionalidade")) return "nacionalidade";
        return "";
    }

    function getSimplifiedDatalistType(name, label) {
        const key = String(name || "").toLowerCase();
        const text = `${key} ${String(label || "").toLowerCase()}`;
        if (key.includes("profissao") || key.includes("profissão") || text.includes("profissão")) return "profissao";
        if (key.includes("orgao") || key.includes("órgão") || text.includes("órgão") || text.includes("orgão")) return "orgao";
        if (key.includes("documento") || text.includes("documento")) return "documento";
        return "";
    }

    function renderSimplifiedSelect(name, selectType) {
        const options = SIMPLIFIED_SELECT_OPTIONS[selectType] || [];
        return `<select name="${escapeAttr(name)}" data-field-name="${escapeAttr(name)}" autocomplete="off">${options.map(([value, label]) => `<option value="${escapeAttr(value)}">${escapeHtml(label)}</option>`).join("")}</select>`;
    }

    function renderSimplifiedDatalist(name, common, datalistType) {
        const id = `list-${String(name).replace(/[^\w-]/g, "-")}`;
        const options = SIMPLIFIED_DATALIST_OPTIONS[datalistType] || [];
        return `<input ${common} list="${escapeAttr(id)}"><datalist id="${escapeAttr(id)}">${options.map((value) => `<option value="${escapeAttr(value)}"></option>`).join("")}</datalist>`;
    }

    function simplifyFieldLabel(name, label) {
        const key = String(name || "").toLowerCase();
        const raw = String(label || formatLabel(name));
        if (key.includes("estado_civil")) return raw.replace(/estado civil/i, "Estado civil");
        if (key.includes("profissao") || key.includes("profissão")) return raw.replace(/profissão/i, "Profissão");
        if (key === "mes" || key.endsWith("_mes")) return "Mês";
        if (key === "uf" || key.endsWith("_uf")) return "UF";
        return raw;
    }


    function renderField(field) {
        const name = field.name;
        const label = simplifyFieldLabel(name, field.label || formatLabel(name));
        const selectType = getSimplifiedSelectType(name, label);
        const datalistType = getSimplifiedDatalistType(name, label);
        const wide = field.wide || isLongField(name, label) ? " wide" : "";
        const textarea = isLongField(name, label) && !selectType && !datalistType;
        const common = `name="${escapeAttr(name)}" data-field-name="${escapeAttr(name)}" placeholder="${escapeAttr(placeholderFor(name))}" autocomplete="off" ${smartAttributesFor(name, label)}`;

        let control = "";
        if (selectType) {
            control = renderSimplifiedSelect(name, selectType);
        } else if (textarea) {
            control = `<textarea ${common}></textarea>`;
        } else if (datalistType) {
            control = renderSimplifiedDatalist(name, common, datalistType);
        } else {
            control = `<input ${common}>`;
        }

        return `<label class="field${wide}"><span>${escapeHtml(label)}</span>${control}</label>`;
    }

    let generateDocumentInFlight = false;

    async function generateDocument(event) {
        if (event?.preventDefault) event.preventDefault();
        if (event?.stopPropagation) event.stopPropagation();

        if (generateDocumentInFlight) return;

        const form = event.target?.closest?.("#documentGenerateForm")
            || event.currentTarget?.closest?.("#documentGenerateForm")
            || event.target?.closest?.("form")
            || $("#documentGenerateForm")
            || event.target;
        const submitter = event.submitter
            || event.target?.closest?.("[data-generate-type]")
            || document.activeElement?.closest?.("[data-generate-type]");
        const generateType = submitter?.dataset?.generateType || "docx";
        const doc = DOC_MAP.get(form?.dataset?.documentId);

        if (!form || !doc) {
            toast("Abra um documento e tente gerar novamente.", "error");
            return;
        }

        const msg = $("#documentFormMessage");
        const isPdf = generateType === "pdf";
        let progressTimer = null;

        let data = {};
        generateDocumentInFlight = true;
        try {
            // IMPORTANTE: coleta antes de desabilitar o formulário.
            // Inputs desabilitados não entram no FormData e isso estava gerando Word/PDF vazio.
            data = collectFormData(form, doc);
            setFormLoading(form, true);
            progressTimer = startGenerateProgress(isPdf ? "pdf" : "docx");

            ensureDocumentAvailable(doc.id);
            setGenerateProgress(18, isPdf ? "Validando saldo e bibliotecas..." : "Validando saldo e bibliotecas...");
            await ensureDocxLibs();

            const modelPath = getModelPath(doc, data);
            if (!modelPath && !doc.modelBase64) {
                throw new Error("Modelo Word não configurado para este documento.");
            }
            const fileName = getFileName(doc, data, isPdf ? "pdf" : "docx");
            setGenerateProgress(38, "Preenchendo o modelo Word...");
            const docxBlob = await buildDocx(modelPath, data, doc);
            if (!(docxBlob instanceof Blob) || docxBlob.size < 64) {
                throw new Error("O arquivo Word gerado está vazio ou inválido. Tente novamente.");
            }

            if (isPdf) {
                if (!API_BASE_URL) {
                    throw new Error("API_BASE_URL não configurada em app-config.js. O PDF precisa do Worker/API para converter DOCX em PDF.");
                }

                setGenerateProgress(55, "Convertendo para PDF no servidor...");
                const docxBase64 = await blobToBase64(docxBlob, true);
                setGenerateProgress(68, "Aguardando conversão do PDF...");

                const response = await apiRequest("/api/documents/preview-pdf", {
                    method: "POST",
                    body: {
                        templatePath: doc.id,
                        docxBase64,
                        fileName: fileName.replace(/\.pdf$/i, ".docx"),
                    },
                });

                if (!response?.pdfBase64) {
                    throw new Error("A API não retornou o PDF gerado.");
                }

                if (response.documentUsage) state.documentUsage = response.documentUsage;

                const pdfName = response.fileName || fileName.replace(/\.docx$/i, ".pdf");
                setGenerateProgress(88, "Montando pré-visualização do PDF...");
                showDocumentPdfPreview(response.pdfBase64, pdfName);

                setGenerateProgress(96, "Iniciando download do PDF...");
                downloadBase64(response.pdfBase64, pdfName, "application/pdf");

                setGenerateProgress(100, "PDF pronto!");
                setMessage(msg, response.message || "PDF gerado. Preview abaixo e download iniciado.", "success");
                window.DocSpaceProduct?.onAfterGenerate?.();
                setTimeout(() => window.DocSpaceProduct?.injectSignatureUi?.(), 80);
            } else {
                setGenerateProgress(80, "Preparando download do Word...");
                saveBlob(docxBlob, fileName);

                apiRequest("/api/documents/usage", {
                    method: "POST",
                    body: { documentType: doc.id },
                }).then((r) => {
                    if (r.documentUsage) state.documentUsage = r.documentUsage;
                }).catch((usageError) => {
                    console.warn("Não foi possível registrar o uso do documento agora.", usageError);
                });

                setGenerateProgress(100, "Word pronto!");
                setMessage(msg, "Documento Word baixado com sucesso.", "success");
                window.DocSpaceProduct?.onAfterGenerate?.();
            }
        } catch (error) {
            console.error(error);
            hideGenerateProgress();
            setMessage(msg, translateError(error), "error");
            toast(translateError(error), "error");
        } finally {
            generateDocumentInFlight = false;
            if (progressTimer) clearInterval(progressTimer);
            setFormLoading(form, false);
            setTimeout(() => hideGenerateProgress(true), 1600);
        }
    }

    function startGenerateProgress(kind = "pdf") {
        const box = $("#documentGenerateProgress");
        const label = $("#documentGenerateProgressLabel");
        const hint = $("#documentGenerateProgressHint");
        if (!box) return null;

        box.classList.remove("is-hidden");
        if (label) {
            label.textContent = kind === "pdf" ? "Gerando PDF protegido..." : "Gerando documento Word...";
        }
        if (hint) {
            hint.textContent = kind === "pdf"
                ? "O PDF passa por preenchimento + conversão no servidor. Isso pode levar alguns segundos."
                : "Montando o arquivo Word com os dados preenchidos...";
        }
        setGenerateProgress(8, kind === "pdf" ? "Iniciando geração do PDF..." : "Iniciando geração do Word...");

        // Avanço suave enquanto espera a API (dá sensação de tempo real).
        let soft = 8;
        return setInterval(() => {
            soft = Math.min(soft + (kind === "pdf" ? 1.2 : 2.2), kind === "pdf" ? 86 : 72);
            const bar = $("#documentGenerateProgressBar");
            const current = Number(bar?.dataset?.pct || 0);
            if (current < soft && current < 90) {
                setGenerateProgress(Math.max(current, soft));
            }
        }, 450);
    }

    function setGenerateProgress(pct, text) {
        const value = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
        const box = $("#documentGenerateProgress");
        const bar = $("#documentGenerateProgressBar");
        const label = $("#documentGenerateProgressLabel");
        const percent = $("#documentGenerateProgressPct");
        const track = box?.querySelector?.('[role="progressbar"]');

        if (box) box.classList.remove("is-hidden");
        if (bar) {
            bar.style.width = `${value}%`;
            bar.dataset.pct = String(value);
        }
        if (percent) percent.textContent = `${value}%`;
        if (track) track.setAttribute("aria-valuenow", String(value));
        if (text && label) label.textContent = text;
    }

    function hideGenerateProgress(keepVisibleIfComplete = false) {
        const box = $("#documentGenerateProgress");
        const bar = $("#documentGenerateProgressBar");
        const pct = Number(bar?.dataset?.pct || 0);
        if (!box) return;
        if (keepVisibleIfComplete && pct >= 100) return;
        box.classList.add("is-hidden");
        if (bar) {
            bar.style.width = "0%";
            bar.dataset.pct = "0";
        }
        const percent = $("#documentGenerateProgressPct");
        if (percent) percent.textContent = "0%";
    }

    function base64ToBlob(base64, mime = "application/pdf") {
        const clean = String(base64 || "").replace(/^data:[^;]+;base64,/, "");
        const bin = atob(clean);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new Blob([bytes], { type: mime || "application/pdf" });
    }

    function clearDocumentPdfPreview() {
        const panel = $("#documentPdfPreview");
        const frame = $("#documentPdfPreviewFrame");
        if (state.pdfPreviewUrl) {
            try { URL.revokeObjectURL(state.pdfPreviewUrl); } catch (_) {}
        }
        state.pdfPreviewUrl = null;
        state.pdfPreviewFileName = "";
        state.pdfPreviewBase64 = "";
        if (frame) frame.removeAttribute("src");
        if (panel) panel.classList.add("is-hidden");
        const fallback = $("#documentPdfPreviewFallback");
        if (fallback) fallback.classList.add("is-hidden");
    }

    function showDocumentPdfPreview(pdfBase64, fileName = "documento.pdf") {
        const panel = $("#documentPdfPreview");
        const frame = $("#documentPdfPreviewFrame");
        const nameEl = $("#documentPdfPreviewName");
        const titleEl = $("#documentPdfPreviewTitle");
        const fallback = $("#documentPdfPreviewFallback");

        if (!panel || !frame) {
            console.warn("Área de preview de PDF não encontrada no formulário.");
            return;
        }

        if (state.pdfPreviewUrl) {
            try { URL.revokeObjectURL(state.pdfPreviewUrl); } catch (_) {}
        }

        const blob = base64ToBlob(pdfBase64, "application/pdf");
        const url = URL.createObjectURL(blob);

        state.pdfPreviewUrl = url;
        state.pdfPreviewFileName = fileName || "documento.pdf";
        state.pdfPreviewBase64 = String(pdfBase64 || "").replace(/^data:[^;]+;base64,/, "");

        if (titleEl) titleEl.textContent = "PDF gerado com sucesso";
        if (nameEl) nameEl.textContent = state.pdfPreviewFileName;
        if (fallback) fallback.classList.add("is-hidden");

        panel.classList.remove("is-hidden");
        frame.src = url;

        // Alguns navegadores/mobile não embutem PDF; mostra fallback se falhar.
        frame.onload = () => {
            if (fallback) fallback.classList.add("is-hidden");
        };
        frame.onerror = () => {
            if (fallback) fallback.classList.remove("is-hidden");
        };

        setTimeout(() => {
            panel.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
    }

    function collectFormData(form, doc) {
        const data = {};

        // Lê diretamente os campos do formulário. Não depende de FormData,
        // porque FormData ignora inputs disabled. Isso era a causa do DOCX/PDF vazio.
        Array.from(form.querySelectorAll("input[name], select[name], textarea[name]")).forEach((field) => {
            if (!field.name) return;
            if (field.type === "submit" || field.type === "button" || field.type === "reset" || field.type === "file") return;
            if (field.closest(".is-conditional-hidden") || field.closest("[hidden]")) return;

            const key = canonicalFieldName(field.name);

            if (field.type === "checkbox") {
                if (!data[key]) data[key] = [];
                if (field.checked) data[key].push(field.value || "Sim");
                return;
            }

            if (field.type === "radio") {
                if (field.checked) data[key] = String(field.value || "").trim();
                return;
            }

            data[key] = String(field.value ?? "").trim();
        });

        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) data[key] = data[key].join(", ");
        });

        // Garante que todas as chaves canônicas do template existam, mesmo vazias.
        (doc.fields || []).forEach((field) => {
            const key = canonicalFieldName(field.name);
            if (!(key in data)) data[key] = "";
        });
        (doc.choices || []).forEach((choice) => {
            const key = canonicalFieldName(choice.name);
            if (!(key in data)) data[key] = "";
        });

        applyCommonTemplateAliases(data);
        if (doc.id === "comodato") applyComodatoAliases(data);
        applyReverseTemplateAliases(data);
        return data;
    }

    function applyReverseTemplateAliases(data) {
        Object.entries(DOCSPACE_FIELD_REVERSE_ALIASES).forEach(([canonical, originals]) => {
            originals.forEach((original) => {
                if (!data[original] && data[canonical]) data[original] = data[canonical];
                if (!data[canonical] && data[original]) data[canonical] = data[original];
            });
        });
    }

    function applyCommonTemplateAliases(data) {
        // Sinônimos comuns usados em modelos diferentes. Não sobrescreve o que o usuário digitou.
        const copy = (target, source) => {
            if (!data[target] && data[source]) data[target] = data[source];
        };

        copy("nome", "nome_pessoa");
        copy("nome_pessoa", "nome");
        copy("nome_declarante", "nome_pessoa");
        copy("nome_pessoa", "nome_declarante");
        copy("profissao_declarante", "profissao");
        copy("profissao", "profissao_declarante");
        copy("estado_civil_declarante", "estado_civil");
        copy("estado_civil", "estado_civil_declarante");
        copy("cpf_declarante", "cpf");
        copy("cpf", "cpf_declarante");
        copy("rg_declarante", "rg");
        copy("rg", "rg_declarante");
        copy("endereco_declarante", "endereco");
        copy("endereco", "endereco_declarante");
        copy("municipio_declarante", "municipio");
        copy("municipio", "municipio_declarante");
        copy("cidade_assinatura", "cidade");
        copy("cidade", "cidade_assinatura");
        copy("data_assinatura_extenso", "data");
    }

    function applyComodatoAliases(data) {
        const copy = (target, source) => {
            if (!data[target] && data[source]) data[target] = data[source];
        };

        copy("nome_comodatario", "nome_comandatario");
        copy("nome_comandatario", "nome_comodatario");

        copy("estado_civil_comodatario", "estado_civil_comandatario");
        copy("estado_civil_comandatario", "estado_civil_comodatario");

        copy("profissao_comodatario", "profissao_comandatario");
        copy("profissao_comandatario", "profissao_comodatario");
        data["profissão_comandatario"] = data["profissão_comandatario"] || data.profissao_comandatario || data.profissao_comodatario || "";
        data["profissão_comodatario"] = data["profissão_comodatario"] || data.profissao_comandatario || data.profissao_comodatario || "";
        data["profissão_comandante"] = data["profissão_comandante"] || data.profissao_comandante || "";

        copy("rg_comodatario", "rg_comandatario");
        copy("rg_comandatario", "rg_comodatario");
        copy("cpf_comodatario", "cpf_comandatario");
        copy("cpf_comandatario", "cpf_comodatario");
        copy("localidade_comodatario", "localidade_comandatario");
        copy("localidade_comandatario", "localidade_comodatario");
        copy("localidade_proxima_comodatario", "localidade_proxima_comandatario");
        copy("localidade_proxima_comandatario", "localidade_proxima_comodatario");

        data["município_comandatrio"] = data["município_comandatrio"] || data.municipio_comandatario || data.municipio_comodatario || "";
        data.municipio_comandatario = data.municipio_comandatario || data["município_comandatrio"] || data.municipio_comodatario || "";
        data.municipio_comodatario = data.municipio_comodatario || data.municipio_comandatario || "";

        data["duração_contrato"] = data["duração_contrato"] || data.duracao_contrato || "";
        data.duracao_contrato = data.duracao_contrato || data["duração_contrato"] || "";

        // Se o modelo escolhido é de falecido, aproveita os dados do comodante se o usuário não duplicar.
        copy("nome_comandante_falecido", "nome_comandante");
        copy("estado_civil_comandante_falecido", "estado_civil_comandante");
        copy("profissao_comandante_falecido", "profissao_comandante");
        copy("rg_comandante_falecido", "rg_comandante");
        copy("cpf_comandante_falecido", "cpf_comandante");
        copy("localidade_comandante_falecido", "localidade_comandante");

        data["endereço_representante"] = data["endereço_representante"] || data.endereco_representante || "";
        data.endereco_representante = data.endereco_representante || data["endereço_representante"] || "";

        data.nacionalidade_comandatario = data.nacionalidade_comandatario || "brasileiro";
        data.nacionalidade_comodatario = data.nacionalidade_comodatario || data.nacionalidade_comandatario;
    }

    function getModelPath(doc, data) {
        if (doc.id === "comodato") {
            const conjuge = data.possui_conjuge === "sim";
            const obito = data.possui_obito === "sim";
            if (obito && conjuge) return doc.modelPaths.comConjugeComObito;
            if (obito) return doc.modelPaths.semConjugeComObito;
            if (conjuge) return doc.modelPaths.comConjugeSemObito;
            return doc.modelPaths.semConjugeSemObito;
        }
        if (doc.id === "autodeclaracao-rural") {
            const key = data.possui_representacao === "sim" ? "sim" : "nao";
            return doc.modelPaths?.[key] || doc.modelPath;
        }
        return doc.modelPath;
    }

    function getFileName(doc, data, ext = "docx") {
        let base = doc.fileName || `${doc.id}.docx`;
        if (doc.id === "autodeclaracao-rural" && doc.fileNames) {
            const key = data.possui_representacao === "sim" ? "sim" : "nao";
            base = doc.fileNames[key] || base;
        }
        return base.replace(/\.docx$/i, `.${ext}`);
    }

    async function buildDocx(path, data, doc = null) {
        let buffer;
        if (doc?.modelBase64) {
            const clean = String(doc.modelBase64).replace(/^data:[^;]+;base64,/, "");
            const binary = atob(clean);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
            buffer = bytes.buffer;
        } else {
            if (!path) throw new Error("Modelo Word não configurado para este documento.");
            const response = await fetch(path, { cache: "no-cache" });
            if (!response.ok) throw new Error(`Modelo não encontrado: ${path}`);
            buffer = await response.arrayBuffer();
        }
        const originalData = normalizeTemplateData(data || {});

        try {
            const renderedBlob = renderDocxWithDocxtemplater(buffer, originalData);
            if (renderedBlob) return renderedBlob;
        } catch (error) {
            console.warn("Docxtemplater não conseguiu renderizar; tentando substituição direta.", error);
        }

        try {
            const directBlob = await buildDocxByDirectXmlReplace(buffer, originalData);
            if (directBlob) return directBlob;
        } catch (directError) {
            console.warn("Fallback direto DOCX falhou.", directError);
        }

        throw new Error("Não foi possível preencher o modelo Word. Verifique os placeholders do template.");
    }

    function renderDocxWithDocxtemplater(buffer, data) {
        if (!window.PizZip || !window.docxtemplater) {
            throw new Error("Bibliotecas DOCX não carregadas.");
        }

        let currentBytes = buffer;
        const rawZip = new window.PizZip(buffer);
        const allXml = rawZip.file(/word\/.*\.xml$/).map((file) => file.asText()).join("\n");
        const hasDoubleTags = /\{\{\s*[^{}]+?\s*\}\}/.test(allXml);
        const hasSingleTags = /(^|[^{])\{\s*[a-zA-ZÀ-ÿ0-9_.-]+\s*\}([^}]|$)/.test(allXml);

        const passes = [];
        if (hasDoubleTags) passes.push({ delimiters: { start: "{{", end: "}}" } });
        if (hasSingleTags) passes.push({ delimiters: { start: "{", end: "}" } });
        if (!passes.length) return null;

        for (const pass of passes) {
            const zip = new window.PizZip(currentBytes);
            const doc = new window.docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                delimiters: pass.delimiters,
                nullGetter: () => "",
            });

            doc.render(data || {});
            currentBytes = doc.getZip().generate({
                type: "uint8array",
                compression: "DEFLATE",
            });
        }

        return new Blob([currentBytes], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
    }

    function normalizeTemplateData(data) {
        const out = { ...(data || {}) };

        const put = (key, value) => {
            if (!key) return;
            if (value === undefined || value === null) value = "";
            const text = String(value);
            if (out[key] === undefined || out[key] === null || out[key] === "") out[key] = text;
        };

        const normalizeKey = (key) => String(key || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        Object.entries(out).forEach(([key, value]) => {
            put(key, value);
            put(normalizeKey(key), value);
            put(String(key).replace(/[\s-]+/g, "_"), value);
            put(normalizeKey(key).replace(/[\s-]+/g, "_"), value);
        });

        const aliases = {
            nome: ["nome_pessoa", "nome_declarante", "nome_cliente", "requerente", "outorgante"],
            nome_pessoa: ["nome", "nome_declarante", "nome_cliente", "requerente", "outorgante"],
            profissao: ["profissão", "profissao_declarante", "profissão_declarante"],
            estado_civil: ["estado_civil_declarante"],
            rg: ["rg_declarante"],
            cpf: ["cpf_declarante", "cpf_cnpj"],
            endereco: ["endereço", "endereco_declarante", "endereço_declarante"],
            municipio: ["município", "municipio_declarante", "município_declarante"],
            cidade: ["cidade_assinatura", "localidade"],
            data: ["data_assinatura", "data_assinatura_extenso"],
            nome_comandatario: ["nome_comodatario"],
            nome_comodatario: ["nome_comandatario"],
            estado_civil_comandatario: ["estado_civil_comodatario"],
            estado_civil_comodatario: ["estado_civil_comandatario"],
            profissao_comandatario: ["profissão_comandatario", "profissao_comodatario", "profissão_comodatario"],
            "profissão_comandatario": ["profissao_comandatario", "profissao_comodatario", "profissão_comodatario"],
            profissao_comandante: ["profissão_comandante"],
            "profissão_comandante": ["profissao_comandante"],
            rg_comandatario: ["rg_comodatario"],
            rg_comodatario: ["rg_comandatario"],
            cpf_comandatario: ["cpf_comodatario"],
            cpf_comodatario: ["cpf_comandatario"],
            localidade_comandatario: ["localidade_comodatario"],
            localidade_comodatario: ["localidade_comandatario"],
            localidade_proxima_comandatario: ["localidade_proxima_comodatario"],
            localidade_proxima_comodatario: ["localidade_proxima_comandatario"],
            municipio_comandatario: ["município_comandatrio", "municipio_comandatrio", "municipio_comodatario"],
            "município_comandatrio": ["municipio_comandatario", "municipio_comandatrio", "municipio_comodatario"],
            duracao_contrato: ["duração_contrato"],
            "duração_contrato": ["duracao_contrato"],
            endereco_representante: ["endereço_representante"],
            "endereço_representante": ["endereco_representante"],
        };

        let changed = true;
        while (changed) {
            changed = false;
            Object.entries(aliases).forEach(([key, list]) => {
                const value = out[key];
                if (value !== undefined && value !== null && String(value) !== "") {
                    list.forEach((alias) => {
                        if (out[alias] === undefined || out[alias] === null || out[alias] === "") {
                            out[alias] = String(value);
                            changed = true;
                        }
                    });
                }
                list.forEach((alias) => {
                    const aliasValue = out[alias];
                    if ((out[key] === undefined || out[key] === null || out[key] === "") && aliasValue !== undefined && aliasValue !== null && String(aliasValue) !== "") {
                        out[key] = String(aliasValue);
                        changed = true;
                    }
                });
            });
        }

        Object.entries({ ...out }).forEach(([key, value]) => {
            put(normalizeKey(key), value);
        });

        return out;
    }

    async function buildDocxByDirectXmlReplace(buffer, data) {
        if (!window.PizZip) throw new Error("PizZip não carregado.");

        const zip = new window.PizZip(buffer);
        const escapeXml = (value) => String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");

        const normalizeKey = (key) => String(key || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        const getValue = (rawKey) => {
            const key = String(rawKey || "").trim();
            const candidates = [
                key,
                normalizeKey(key),
                key.replace(/[\s-]+/g, "_"),
                normalizeKey(key).replace(/[\s-]+/g, "_"),
                canonicalFieldName(key),
                normalizeKey(canonicalFieldName(key)),
            ];

            for (const candidate of candidates) {
                if (data[candidate] !== undefined && data[candidate] !== null) return data[candidate];
            }
            return "";
        };

        let touched = false;
        zip.file(/word\/.*\.xml$/).forEach((file) => {
            const before = file.asText();
            let after = before.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_match, key) => {
                touched = true;
                return escapeXml(getValue(key));
            });

            after = after.replace(/(?<!\{)\{\s*([a-zA-ZÀ-ÿ0-9_.-]+)\s*\}(?!\})/g, (_match, key) => {
                touched = true;
                return escapeXml(getValue(key));
            });

            if (after !== before) zip.file(file.name, after);
        });

        if (!touched) return null;

        return zip.generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE",
        });
    }

    function renderPdfTools() {
        const activeId = state.activePdfTool in PDF_TOOLS ? state.activePdfTool : "compress";
        state.activePdfTool = activeId;
        const active = PDF_TOOLS[activeId];
        const remaining = getTotalRemainingPdf();
        const allowed = state.pdfToolUsage?.allowed !== false || state.pdfToolUsage?.unlimited || isAdmin();
        const visibleTools = Object.entries(PDF_TOOLS).filter(([, tool]) => state.pdfCategory === "todos" || tool.category === state.pdfCategory);

        refs.content.innerHTML = `
            <article class="panel pdf-hub">
                <header class="pdf-hub-header">
                    <div><p class="section-label">Central de processamento</p><h2>Ferramentas PDF</h2><p>${Object.keys(PDF_TOOLS).length} operações organizadas por finalidade. Limite por arquivo: até 500 MB.</p></div>
                    <div class="pdf-balance"><small>Saldo disponível</small><strong>${state.pdfToolUsage?.unlimited || isAdmin() ? "∞" : remaining}</strong></div>
                </header>
                <div class="pdf-hub-body">
                    ${!allowed && !isAdmin() ? `<p class="message error">Ferramentas PDF não liberadas para este login. Peça ao administrador.</p>` : ""}
                    <div class="chips pdf-category-chips">
                        ${PDF_CATEGORIES.map((category) => `<button type="button" class="chip ${state.pdfCategory === category.id ? "is-active" : ""}" data-pdf-category="${category.id}">${escapeHtml(category.label)}</button>`).join("")}
                    </div>
                    <div class="pdf-tool-grid">
                        ${visibleTools.map(([id, tool]) => `
                            <button type="button" class="pdf-tool-card ${id === activeId ? "is-active" : ""}" data-pdf-tool="${escapeAttr(id)}">
                                <span class="pdf-tool-icon"><i data-lucide="${escapeAttr(PDF_TOOL_LUCIDE[id] || "file-cog")}"></i></span>
                                <strong>${escapeHtml(tool.title)}</strong>
                                <small>${tool.server ? "Servidor" : "Navegador"}</small>
                            </button>`).join("")}
                    </div>
                </div>
            </article>

            <article class="panel pdf-workbench">
                <div class="pdf-workbench-head">
                    <span class="pdf-workbench-icon"><i data-lucide="${escapeAttr(PDF_TOOL_LUCIDE[activeId] || "file-cog")}"></i></span>
                    <div>
                        <span class="badge ${active.server ? "" : "warn"}">${active.server ? "Processamento no servidor" : "Processamento no navegador"}</span>
                        <h2>${escapeHtml(active.title)}</h2>
                        <p>${escapeHtml(active.description)}</p>
                        ${active.hint ? `<p class="pdf-tool-hint">${escapeHtml(active.hint)}</p>` : ""}
                    </div>
                </div>

                <form id="pdfToolForm" class="form-grid pdf-tool-form">
                    <div class="field wide">
                        <div id="pdfDropZone" class="pdf-dropzone" tabindex="0" role="button" aria-label="Selecionar arquivos">
                            <strong>Selecione ou arraste o arquivo</strong>
                            <span>${active.multiple ? "É possível escolher vários arquivos" : "Escolha um arquivo para processar"}</span>
                            <span class="pdf-dropzone-accept">Formatos aceitos: ${escapeHtml(active.accept)}</span>
                            <input id="pdfFiles" type="file" accept="${escapeAttr(active.accept)}" ${active.multiple ? "multiple" : ""} hidden>
                        </div>
                        <div id="pdfFileList" class="pdf-file-list"></div>
                    </div>
                    ${active.pages ? `<label class="field wide"><span>${escapeHtml(active.pages)}</span><input id="pdfPages" type="text" placeholder="Ex.: 1,3-5" ${active.requiredPages ? "required" : ""} autocomplete="off"></label>` : ""}
                    ${renderPdfToolOptions(active)}
                    <div class="field wide">
                        <div id="pdfToolProgress" class="generate-progress is-hidden" aria-live="polite">
                            <div class="generate-progress-head"><strong id="pdfToolProgressLabel">Processando...</strong><span id="pdfToolProgressPct">0%</span></div>
                            <div class="generate-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="pdfToolProgressBar" class="generate-progress-bar"></div></div>
                            <p id="pdfToolProgressHint" class="generate-progress-hint">Aguarde o processamento.</p>
                        </div>
                        <p id="pdfMessage" class="message"></p>
                        <div id="pdfToolStats" class="pdf-tool-stats is-hidden"></div>
                    </div>
                    <div class="field wide action-row">
                        <button class="primary-button" type="submit" id="pdfProcessButton"><i data-lucide="play"></i> ${escapeHtml(activeId === "compress" ? "Comprimir PDF" : "Processar arquivo")}</button>
                        <button class="ghost-button" type="button" data-pdf-clear-files><i data-lucide="x"></i> Limpar arquivos</button>
                    </div>
                </form>
            </article>

            <section id="pdfToolResult" class="pdf-preview-panel is-hidden" aria-live="polite">
                <div class="pdf-preview-head">
                    <div><p class="eyebrow">Resultado</p><h3 id="pdfToolResultTitle">PDF processado</h3><p id="pdfToolResultName" class="pdf-preview-name"></p></div>
                    <div class="pdf-preview-actions">
                        <button type="button" class="secondary-button" data-pdf-tool-download><i data-lucide="download"></i> Baixar novamente</button>
                        <button type="button" class="secondary-button" data-pdf-tool-open><i data-lucide="external-link"></i> Abrir em nova aba</button>
                        <button type="button" class="ghost-button" data-pdf-tool-close-result>Ocultar</button>
                    </div>
                </div>
                <div class="pdf-preview-frame-wrap"><iframe id="pdfToolResultFrame" class="pdf-preview-frame" title="Pré-visualização do PDF processado"></iframe></div>
            </section>`;
        bindPdfToolUi();
        initIcons();
    }

    function renderPdfToolOptions(active) {
        const blocks = [];
        if (active.rotation) blocks.push(`<label class="field"><span>Rotação</span><select id="pdfRotation"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label>`);
        if (active.compression) blocks.push(`
            <label class="field"><span>Nível de compressão</span><select id="pdfCompression"><option value="screen">Máxima</option><option value="balanced" selected>Equilibrada</option><option value="printer">Alta qualidade</option></select></label>
            <label class="field"><span>Modo</span><select id="pdfCompressMode"><option value="auto" selected>Automático</option><option value="server">Somente servidor</option><option value="local">Somente navegador</option></select></label>`);
        if (active.ocr) blocks.push(`<label class="field"><span>Idioma OCR</span><select id="pdfLanguage"><option value="por" selected>Português</option><option value="eng">Inglês</option><option value="spa">Espanhol</option><option value="por+eng">Português + Inglês</option></select></label>`);
        if (active.splitSizeOpts) blocks.push(`
            <label class="field"><span>Tamanho máximo por parte (MB)</span><input id="pdfMaxPartMb" type="number" min="0.2" max="50" step="0.1" value="4.5" inputmode="decimal"></label>
            <label class="field"><span>Qualidade para página muito pesada</span><select id="pdfSplitQuality"><option value="0.82">Alta</option><option value="0.68" selected>Equilibrada</option><option value="0.52">Arquivo menor</option></select></label>`);
        if (active.blankPages) blocks.push(`
            <label class="field"><span>Quantidade</span><input id="pdfBlankCount" type="number" min="1" max="50" value="1"></label>
            <label class="field"><span>Posição</span><select id="pdfBlankPosition"><option value="end">No fim</option><option value="start">No início</option><option value="after">Depois de uma página</option></select></label>
            <label class="field"><span>Depois da página</span><input id="pdfBlankAfter" type="number" min="1" value="1"></label>`);
        if (active.oddEven) blocks.push(`<label class="field"><span>Resultado</span><select id="pdfOddEven"><option value="split">Separar em dois arquivos</option><option value="odd">Somente ímpares</option><option value="even">Somente pares</option></select></label>`);
        if (active.imagesOpts) blocks.push(`
            <label class="field"><span>Tamanho da página</span><select id="pdfImageFit"><option value="a4" selected>Encaixar em A4</option><option value="original">Tamanho original</option></select></label>
            <label class="field"><span>Margem A4 (pt)</span><input id="pdfImageMargin" type="number" min="0" max="120" value="24"></label>`);
        if (active.numberOpts) blocks.push(`
            <label class="field"><span>Formato</span><select id="pdfNumberFormat"><option value="page_of">Página 1 de 10</option><option value="plain">Somente número</option><option value="dash">- 1 -</option></select></label>
            <label class="field"><span>Posição</span><select id="pdfNumberPosition"><option value="bottom-center">Rodapé central</option><option value="bottom-left">Rodapé esquerdo</option><option value="bottom-right">Rodapé direito</option><option value="top-center">Topo central</option></select></label>
            <label class="field"><span>Começar em</span><input id="pdfNumberStart" type="number" min="1" value="1"></label>`);
        if (active.watermarkOpts) blocks.push(`
            <label class="field wide"><span>Texto da marca d'água</span><input id="pdfWatermarkText" value="CONFIDENCIAL" maxlength="80"></label>
            <label class="field"><span>Tamanho</span><input id="pdfWatermarkSize" type="number" min="18" max="96" value="48"></label>
            <label class="field"><span>Intensidade</span><input id="pdfWatermarkOpacity" type="range" min="0.08" max="0.55" step="0.01" value="0.18"></label>`);
        if (active.stampOpts) blocks.push(`
            <label class="field"><span>Texto do carimbo</span><input id="pdfStampText" value="CÓPIA" maxlength="60"></label>
            <label class="field"><span>Posição</span><select id="pdfStampPosition"><option value="top-right">Topo direito</option><option value="top-left">Topo esquerdo</option><option value="bottom-right">Rodapé direito</option><option value="bottom-left">Rodapé esquerdo</option><option value="center">Centro</option></select></label>`);
        if (active.headerFooterOpts) blocks.push(`
            <label class="field wide"><span>Cabeçalho</span><input id="pdfHeaderText" maxlength="120"></label>
            <label class="field wide"><span>Rodapé</span><input id="pdfFooterText" maxlength="120"></label>`);
        if (active.pdfImagesOpts) blocks.push(`
            <label class="field"><span>Formato das imagens</span><select id="pdfImageFormat"><option value="png">PNG</option><option value="jpg">JPG</option></select></label>
            <label class="field"><span>Qualidade / resolução</span><select id="pdfImageScale"><option value="1">Normal</option><option value="1.5" selected>Alta</option><option value="2">Muito alta</option></select></label>`);
        if (active.cropOpts) blocks.push(`
            <label class="field"><span>Margem superior (pt)</span><input id="pdfCropTop" type="number" min="0" max="300" value="0"></label>
            <label class="field"><span>Margem direita (pt)</span><input id="pdfCropRight" type="number" min="0" max="300" value="0"></label>
            <label class="field"><span>Margem inferior (pt)</span><input id="pdfCropBottom" type="number" min="0" max="300" value="0"></label>
            <label class="field"><span>Margem esquerda (pt)</span><input id="pdfCropLeft" type="number" min="0" max="300" value="0"></label>`);
        if (active.resizeOpts) blocks.push(`<label class="field"><span>Margem interna A4 (pt)</span><input id="pdfResizeMargin" type="number" min="0" max="120" value="24"></label>`);
        if (active.metadataOpts) blocks.push(`
            <label class="field wide"><span>Título</span><input id="pdfMetadataTitle" maxlength="160"></label>
            <label class="field"><span>Autor</span><input id="pdfMetadataAuthor" maxlength="120"></label>
            <label class="field"><span>Assunto</span><input id="pdfMetadataSubject" maxlength="160"></label>
            <label class="field wide"><span>Palavras-chave</span><input id="pdfMetadataKeywords" placeholder="contrato, cliente, arquivo" maxlength="240"></label>`);
        return blocks.join("");
    }

    function bindPdfToolUi() {
        const input = $("#pdfFiles");
        const zone = $("#pdfDropZone");
        if (!input || !zone) return;

        const openPicker = () => input.click();
        zone.addEventListener("click", openPicker);
        zone.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
            }
        });

        ["dragenter", "dragover"].forEach((type) => {
            zone.addEventListener(type, (event) => {
                event.preventDefault();
                zone.classList.add("is-dragover");
            });
        });
        ["dragleave", "drop"].forEach((type) => {
            zone.addEventListener(type, (event) => {
                event.preventDefault();
                zone.classList.remove("is-dragover");
            });
        });
        zone.addEventListener("drop", (event) => {
            const files = Array.from(event.dataTransfer?.files || []);
            if (!files.length) return;
            assignPdfFiles(files);
        });

        input.addEventListener("change", () => {
            assignPdfFiles(Array.from(input.files || []));
        });

        renderPdfFileList();
    }

    function assignPdfFiles(files) {
        const tool = PDF_TOOLS[state.activePdfTool];
        const list = tool?.multiple ? files : files.slice(0, 1);
        state.pdfToolSelectedFiles = list;
        const input = $("#pdfFiles");
        if (input) {
            try {
                const dt = new DataTransfer();
                list.forEach((file) => dt.items.add(file));
                input.files = dt.files;
            } catch (_) {
                // Alguns browsers não permitem setar files; a lista em state cobre o fluxo.
            }
        }
        renderPdfFileList();
        setMessage($("#pdfMessage"), "", "");
    }

    function renderPdfFileList() {
        const box = $("#pdfFileList");
        if (!box) return;
        const files = state.pdfToolSelectedFiles || [];
        if (!files.length) {
            box.innerHTML = `<p class="message">Nenhum arquivo selecionado.</p>`;
            return;
        }
        box.innerHTML = files.map((file, index) => `
            <div class="pdf-file-item">
                <div>
                    <strong>${escapeHtml(file.name)}</strong>
                    <small>${formatBytes(file.size)} · ${escapeHtml(file.type || "arquivo")}</small>
                </div>
                <button type="button" class="ghost-button" data-pdf-remove-file="${index}">Remover</button>
            </div>
        `).join("");
    }

    function collectPdfToolOptions() {
        return {
            rotation: Number($("#pdfRotation")?.value || 90),
            level: $("#pdfCompression")?.value || "balanced",
            language: $("#pdfLanguage")?.value || "por",
            maxPartMb: Number($("#pdfMaxPartMb")?.value || 4.5),
            splitQuality: Number($("#pdfSplitQuality")?.value || 0.68),
            blankCount: Number($("#pdfBlankCount")?.value || 1),
            blankPosition: $("#pdfBlankPosition")?.value || "end",
            blankAfter: Number($("#pdfBlankAfter")?.value || 1),
            oddEven: $("#pdfOddEven")?.value || "split",
            imageFit: $("#pdfImageFit")?.value || "a4",
            imageMargin: Number($("#pdfImageMargin")?.value || 24),
            numberFormat: $("#pdfNumberFormat")?.value || "page_of",
            numberPosition: $("#pdfNumberPosition")?.value || "bottom-center",
            numberStart: Number($("#pdfNumberStart")?.value || 1),
            watermarkText: $("#pdfWatermarkText")?.value || "CONFIDENCIAL",
            watermarkSize: Number($("#pdfWatermarkSize")?.value || 48),
            watermarkOpacity: Number($("#pdfWatermarkOpacity")?.value || 0.18),
            stampText: $("#pdfStampText")?.value || "CÓPIA",
            stampPosition: $("#pdfStampPosition")?.value || "top-right",
            headerText: $("#pdfHeaderText")?.value || "",
            footerText: $("#pdfFooterText")?.value || "",
            pdfImageFormat: $("#pdfImageFormat")?.value || "png",
            pdfImageScale: Number($("#pdfImageScale")?.value || 1.5),
            cropTop: Number($("#pdfCropTop")?.value || 0),
            cropRight: Number($("#pdfCropRight")?.value || 0),
            cropBottom: Number($("#pdfCropBottom")?.value || 0),
            cropLeft: Number($("#pdfCropLeft")?.value || 0),
            resizeMargin: Number($("#pdfResizeMargin")?.value || 24),
            metadataTitle: $("#pdfMetadataTitle")?.value || "",
            metadataAuthor: $("#pdfMetadataAuthor")?.value || "",
            metadataSubject: $("#pdfMetadataSubject")?.value || "",
            metadataKeywords: $("#pdfMetadataKeywords")?.value || "",
        };
    }

    async function processPdfTool(event) {
        const form = event.target;
        const msg = $("#pdfMessage");
        const pages = $("#pdfPages")?.value.trim() || "";
        const toolId = state.activePdfTool;
        const tool = PDF_TOOLS[toolId];
        const files = state.pdfToolSelectedFiles?.length ? state.pdfToolSelectedFiles : Array.from($("#pdfFiles")?.files || []);
        const options = collectPdfToolOptions();

        if (!tool) return setMessage(msg, "Ferramenta inválida.", "error");
        if (!files.length) return setMessage(msg, "Escolha ao menos um arquivo.", "error");
        if (tool.multiple && toolId === "merge" && files.length < 2) return setMessage(msg, "Para juntar, selecione pelo menos 2 PDFs.", "error");
        if (tool.requiredPages && !pages) return setMessage(msg, "Informe as páginas necessárias.", "error");
        if (toolId === "splitSize" && (!Number.isFinite(options.maxPartMb) || options.maxPartMb < 0.2)) return setMessage(msg, "Informe um tamanho máximo válido.", "error");

        for (const file of files) {
            const max = toolId === "compress" ? PDF_MAX_LOCAL_BYTES : (tool.server ? PDF_MAX_SERVER_BYTES : PDF_MAX_LOCAL_BYTES);
            if (file.size > max) return setMessage(msg, `Arquivo "${file.name}" excede o limite de ${formatBytes(max)}.`, "error");
        }

        clearPdfToolResult();
        setFormLoading(form, true);
        showPdfToolProgress(8, toolId === "compress" ? "Iniciando compressão..." : "Iniciando processamento...");
        setMessage(msg, "", "");
        hidePdfToolStats();

        try {
            if (toolId === "compress") {
                await processCompressPdf(files[0], pages);
            } else if (tool.server) {
                for (const [index, file] of files.entries()) {
                    showPdfToolProgress(15 + Math.round((index / files.length) * 70), `Enviando ${index + 1}/${files.length} para o servidor...`);
                    const data = await apiRequest("/api/pdf-tools/process", {
                        method: "POST",
                        body: { toolType: toolId, fileName: file.name, fileBase64: await blobToBase64(file, true), options: { ...options, pages } },
                    });
                    if (data.pdfToolUsage) state.pdfToolUsage = data.pdfToolUsage;
                    const outName = data.fileName || `${toolId}-${file.name}`.replace(/\.[^.]+$/, ".pdf");
                    showPdfToolResult(data.pdfBase64, outName, { originalBytes: data.originalBytes || file.size, outputBytes: data.outputBytes || null, message: data.message, strategy: data.strategy });
                    downloadBase64(data.pdfBase64, outName, "application/pdf");
                }
                showPdfToolProgress(100, "Concluído!");
                setMessage(msg, "Processamento concluído. Pré-visualização disponível abaixo.", "success");
            } else {
                showPdfToolProgress(25, "Processando com segurança no navegador...");
                const result = await processPdfLocal(toolId, files, pages, options);
                showPdfToolProgress(85, "Registrando uso...");
                await apiRequest("/api/pdf-tools/usage", { method: "POST", body: { toolType: toolId } }).then((r) => { if (r.pdfToolUsage) state.pdfToolUsage = r.pdfToolUsage; }).catch(() => {});
                showPdfToolProgress(100, "Concluído!");
                let finalMessage = result?.message || "Arquivo preparado e download iniciado.";
                if (Array.isArray(result?.files) && result.files.length) {
                    const packaged = await downloadPdfOutputCollection(result.files, toolId);
                    finalMessage = `${result.message || `${result.files.length} arquivo(s) gerado(s).`} ${packaged.message}`.trim();
                    const first = result.files[0];
                    if (first?.blob?.type === "application/pdf" || /\.pdf$/i.test(first?.fileName || "")) {
                        await presentPdfToolBlob(first.blob, first.fileName, { originalBytes: result.originalBytes, message: `${finalMessage} Primeiro arquivo exibido no preview.` });
                    }
                } else if (result?.blob) {
                    saveBlob(result.blob, result.fileName || `${toolId}.pdf`);
                    await presentPdfToolBlob(result.blob, result.fileName || `${toolId}.pdf`, { originalBytes: result.originalBytes, message: result.message });
                }
                setMessage(msg, finalMessage, "success");
            }
        } catch (error) {
            console.error(error);
            hidePdfToolProgress();
            setMessage(msg, translateError(error), "error");
        } finally {
            setFormLoading(form, false);
            setTimeout(() => hidePdfToolProgress(true), 1800);
        }
    }

    async function processCompressPdf(file, pagesText = "") {
        const mode = $("#pdfCompressMode")?.value || "auto";
        const level = $("#pdfCompression")?.value || "balanced";
        const originalBytes = file.size;
        let workingFile = file;

        // Se o usuário escolheu páginas, extrai localmente antes de comprimir.
        if (pagesText) {
            showPdfToolProgress(18, "Extraindo páginas selecionadas...");
            const extracted = await extractPdfPagesToBlob(file, pagesText);
            workingFile = new File([extracted], file.name.replace(/\.pdf$/i, "-paginas.pdf"), { type: "application/pdf" });
        }

        let result = null;
        let usedLocal = false;

        if (mode === "local") {
            showPdfToolProgress(40, "Comprimindo localmente...");
            result = await compressPdfLocal(workingFile, level);
            usedLocal = true;
        } else {
            try {
                showPdfToolProgress(35, "Enviando para compressão no servidor...");
                const data = await apiRequest("/api/pdf-tools/process", {
                    method: "POST",
                    body: {
                        toolType: "compress",
                        fileName: workingFile.name,
                        fileBase64: await blobToBase64(workingFile, true),
                        options: { level, pages: pagesText },
                    },
                });
                if (data.pdfToolUsage) state.pdfToolUsage = data.pdfToolUsage;
                result = {
                    base64: data.pdfBase64,
                    fileName: data.fileName || workingFile.name.replace(/\.pdf$/i, "-compactado.pdf"),
                    originalBytes: data.originalBytes || originalBytes,
                    outputBytes: data.outputBytes,
                    message: data.message || "PDF comprimido no servidor.",
                    strategy: data.strategy || "server",
                };
                showPdfToolProgress(90, "Montando resultado...");
            } catch (serverError) {
                if (mode === "server") throw serverError;
                console.warn("Compressão no servidor falhou; usando fallback local.", serverError);
                showPdfToolProgress(55, "Servidor indisponível — compactando localmente...");
                result = await compressPdfLocal(workingFile, level);
                usedLocal = true;
                // Tenta registrar uso mesmo no fallback
                await apiRequest("/api/pdf-tools/usage", { method: "POST", body: { toolType: "compress" } })
                    .then((r) => { if (r.pdfToolUsage) state.pdfToolUsage = r.pdfToolUsage; })
                    .catch(() => {});
            }
        }

        if (!result?.base64 && !result?.blob) {
            throw new Error("Não foi possível comprimir o PDF.");
        }

        if (result.blob && !result.base64) {
            result.base64 = await blobToBase64(result.blob, true);
        }

        const outName = result.fileName || file.name.replace(/\.pdf$/i, "-compactado.pdf");
        const outputBytes = result.outputBytes || estimateBase64Bytes(result.base64);
        showPdfToolResult(result.base64, outName, {
            originalBytes: result.originalBytes || originalBytes,
            outputBytes,
            message: result.message,
            strategy: result.strategy || (usedLocal ? "local-fallback" : "server"),
        });
        downloadBase64(result.base64, outName, "application/pdf");
        showPdfToolProgress(100, "Compressão concluída!");
        setMessage(
            $("#pdfMessage"),
            result.message || (usedLocal
                ? "PDF comprimido no navegador (fallback). Preview abaixo."
                : "PDF comprimido com sucesso. Preview abaixo."),
            "success"
        );
    }

    async function compressPdfLocal(file, level = "balanced") {
        if (!window.PDFLib) throw new Error("Biblioteca PDF não carregada.");
        const { PDFDocument } = window.PDFLib;
        const originalBytes = file.size;
        const src = await loadPdfDocument(await file.arrayBuffer());

        // Regravação limpa: remove objetos mortos e recompacta streams via save.
        // Nível influencia useObjectStreams / objectsPerTick (mais agressivo = menor).
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((page) => out.addPage(page));

        const saveOptions = {
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: level === "screen" ? 20 : level === "printer" ? 100 : 50,
        };

        let bytes = await out.save(saveOptions);
        // Se não reduziu, tenta sem object streams (às vezes menor em PDFs simples).
        if (bytes.byteLength >= originalBytes) {
            const alt = await out.save({ useObjectStreams: false, addDefaultPage: false });
            if (alt.byteLength < bytes.byteLength) bytes = alt;
        }

        const blob = new Blob([bytes], { type: "application/pdf" });
        const ratio = originalBytes > 0 ? Math.round((1 - blob.size / originalBytes) * 100) : 0;
        const message = blob.size < originalBytes
            ? `Compactação local: ${formatBytes(originalBytes)} → ${formatBytes(blob.size)} (${ratio}% menor).`
            : `Compactação local aplicada (${formatBytes(blob.size)}). O arquivo já estava otimizado ou tem pouco ganho local — tente o modo servidor.`;

        return {
            blob,
            base64: await blobToBase64(blob, true),
            fileName: file.name.replace(/\.pdf$/i, "-compactado-local.pdf"),
            originalBytes,
            outputBytes: blob.size,
            message,
            strategy: "local",
        };
    }

    async function extractPdfPagesToBlob(file, pagesText) {
        if (!window.PDFLib) throw new Error("Biblioteca PDF não carregada.");
        const { PDFDocument } = window.PDFLib;
        const src = await loadPdfDocument(await file.arrayBuffer());
        const total = src.getPageCount();
        const indexes = parsePages(pagesText, total);
        if (!indexes.length) throw new Error("Nenhuma página válida informada para extrair.");
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, indexes);
        copied.forEach((page) => out.addPage(page));
        const bytes = await out.save({ useObjectStreams: true });
        return new Blob([bytes], { type: "application/pdf" });
    }

    async function processPdfLocal(tool, files, pagesText, options = {}) {
        if (tool === "pdfImages") {
            if (!window.pdfjsLib) throw new Error("Módulo de renderização PDF não carregado.");
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            const file = files[0];
            const loading = window.pdfjsLib.getDocument({ data: await file.arrayBuffer() });
            const pdf = await loading.promise;
            const selected = pagesText ? parsePages(pagesText, pdf.numPages) : Array.from({ length: pdf.numPages }, (_, index) => index);
            if (!selected.length) throw new Error("Informe páginas válidas.");
            const scale = Math.max(0.7, Math.min(2.5, Number(options.pdfImageScale || 1.5)));
            const format = options.pdfImageFormat === "jpg" ? "jpg" : "png";
            const output = [];
            for (const [position, index] of selected.entries()) {
                showPdfToolProgress(20 + Math.round((position / selected.length) * 65), `Convertendo página ${index + 1}...`);
                const page = await pdf.getPage(index + 1);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(viewport.width); canvas.height = Math.round(viewport.height);
                const context = canvas.getContext("2d", { alpha: false });
                context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height);
                await page.render({ canvasContext: context, viewport }).promise;
                const mime = format === "jpg" ? "image/jpeg" : "image/png";
                const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Falha ao gerar imagem.")), mime, format === "jpg" ? 0.9 : undefined));
                output.push({ fileName: `${file.name.replace(/\.pdf$/i, "")}-pagina-${String(index + 1).padStart(3, "0")}.${format}`, blob });
            }
            try { await pdf.destroy(); } catch (_) {}
            return { files: output, originalBytes: file.size, message: `${output.length} imagem(ns) gerada(s).` };
        }
        if (!window.PDFLib) throw new Error("Biblioteca PDF não carregada.");
        const { PDFDocument, degrees, rgb, StandardFonts } = window.PDFLib;

        if (tool === "merge") {
            const out = await PDFDocument.create();
            let originalBytes = 0;
            for (const file of files) {
                originalBytes += file.size;
                const pdf = await loadPdfDocument(await file.arrayBuffer());
                const copied = await out.copyPages(pdf, pdf.getPageIndices());
                copied.forEach((page) => out.addPage(page));
            }
            const blob = await pdfDocToBlob(out);
            return { blob, fileName: "pdf-juntado.pdf", originalBytes, message: `Juntados ${files.length} PDFs.` };
        }

        if (tool === "images") {
            const out = await PDFDocument.create();
            const fitA4 = options.imageFit !== "original";
            const margin = Math.max(0, Math.min(120, Number(options.imageMargin || 24)));
            for (const file of files) {
                const bytes = await file.arrayBuffer();
                const isPng = /png$/i.test(file.type) || /\.png$/i.test(file.name);
                let image;
                try { image = isPng ? await out.embedPng(bytes) : await out.embedJpg(bytes); }
                catch (_) { throw new Error(`Não foi possível ler a imagem: ${file.name}. Use JPG ou PNG.`); }
                if (fitA4) {
                    const width = 595.28, height = 841.89;
                    const page = out.addPage([width, height]);
                    const scale = Math.min((width - margin * 2) / image.width, (height - margin * 2) / image.height, 1);
                    const w = image.width * scale, h = image.height * scale;
                    page.drawImage(image, { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h });
                } else {
                    const page = out.addPage([image.width, image.height]);
                    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                }
            }
            const blob = await pdfDocToBlob(out);
            return { blob, fileName: "imagens.pdf", originalBytes: files.reduce((sum, file) => sum + file.size, 0), message: `${files.length} imagem(ns) convertida(s).` };
        }

        const originalBuffer = await files[0].arrayBuffer();
        const src = await loadPdfDocument(originalBuffer.slice(0));
        const total = src.getPageCount();
        const baseName = files[0].name.replace(/\.pdf$/i, "") || "documento";
        const originalBytes = files[0].size;

        if (tool === "splitSize") {
            return splitPdfByMaxSizeLocal(files[0], src, Math.round(options.maxPartMb * 1024 * 1024), options.splitQuality);
        }
        if (tool === "clean") {
            const out = await PDFDocument.create();
            const copied = await out.copyPages(src, src.getPageIndices());
            copied.forEach((page) => out.addPage(page));
            out.setTitle(""); out.setAuthor(""); out.setSubject(""); out.setKeywords([]); out.setCreator("DocSpace"); out.setProducer("DocSpace");
            const blob = await pdfDocToBlob(out);
            return { blob, fileName: `${baseName}-limpo.pdf`, originalBytes, message: "Metadados e objetos não utilizados foram removidos." };
        }
        if (tool === "metadata") {
            src.setTitle(String(options.metadataTitle || ""));
            src.setAuthor(String(options.metadataAuthor || ""));
            src.setSubject(String(options.metadataSubject || ""));
            src.setKeywords(String(options.metadataKeywords || "").split(",").map((item) => item.trim()).filter(Boolean));
            src.setCreator("DocSpace"); src.setProducer("DocSpace"); src.setModificationDate(new Date());
            return { blob: await pdfDocToBlob(src), fileName: `${baseName}-metadados.pdf`, originalBytes, message: "Metadados atualizados." };
        }
        if (tool === "crop") {
            const selected = new Set(pagesText ? parsePages(pagesText, total) : src.getPageIndices());
            if (!selected.size) throw new Error("Informe páginas válidas.");
            const top = Math.max(0, Number(options.cropTop || 0));
            const right = Math.max(0, Number(options.cropRight || 0));
            const bottom = Math.max(0, Number(options.cropBottom || 0));
            const left = Math.max(0, Number(options.cropLeft || 0));
            src.getPages().forEach((page, index) => {
                if (!selected.has(index)) return;
                const { width, height } = page.getSize();
                const nextWidth = width - left - right, nextHeight = height - top - bottom;
                if (nextWidth < 72 || nextHeight < 72) throw new Error(`O recorte deixa a página ${index + 1} pequena demais.`);
                page.setCropBox(left, bottom, nextWidth, nextHeight);
            });
            return { blob: await pdfDocToBlob(src), fileName: `${baseName}-recortado.pdf`, originalBytes, message: `${selected.size} página(s) recortada(s).` };
        }
        if (tool === "resizeA4") {
            const out = await PDFDocument.create();
            const targetWidth = 595.28, targetHeight = 841.89;
            const margin = Math.max(0, Math.min(120, Number(options.resizeMargin || 24)));
            for (const page of src.getPages()) {
                const { width, height } = page.getSize();
                const embedded = await out.embedPage(page);
                const portrait = height >= width;
                const pageWidth = portrait ? targetWidth : targetHeight;
                const pageHeight = portrait ? targetHeight : targetWidth;
                const scale = Math.min((pageWidth - margin * 2) / width, (pageHeight - margin * 2) / height);
                const newPage = out.addPage([pageWidth, pageHeight]);
                const drawWidth = width * scale, drawHeight = height * scale;
                newPage.drawPage(embedded, { x: (pageWidth - drawWidth) / 2, y: (pageHeight - drawHeight) / 2, width: drawWidth, height: drawHeight });
            }
            return { blob: await pdfDocToBlob(out), fileName: `${baseName}-a4.pdf`, originalBytes, message: `${total} página(s) padronizada(s) em A4.` };
        }
        if (tool === "reverse") {
            const out = await PDFDocument.create();
            const indexes = src.getPageIndices().reverse();
            const copied = await out.copyPages(src, indexes); copied.forEach((page) => out.addPage(page));
            return { blob: await pdfDocToBlob(out), fileName: `${baseName}-invertido.pdf`, originalBytes, message: `${total} páginas invertidas.` };
        }
        if (tool === "blank") {
            const out = await PDFDocument.create();
            const count = Math.max(1, Math.min(50, Number(options.blankCount || 1)));
            const position = options.blankPosition || "end";
            const afterIndex = Math.max(0, Math.min(total, Number(options.blankAfter || 1)));
            const addBlanks = () => { for (let i = 0; i < count; i++) out.addPage([595.28, 841.89]); };
            if (position === "start") addBlanks();
            for (let i = 0; i < total; i++) {
                const [page] = await out.copyPages(src, [i]); out.addPage(page);
                if (position === "after" && i + 1 === afterIndex) addBlanks();
            }
            if (position === "end") addBlanks();
            return { blob: await pdfDocToBlob(out), fileName: `${baseName}-com-paginas-em-branco.pdf`, originalBytes, message: `${count} página(s) em branco inserida(s).` };
        }
        if (tool === "duplicate") {
            const selected = pagesText ? parsePages(pagesText, total) : src.getPageIndices();
            if (!selected.length) throw new Error("Informe páginas válidas para duplicar.");
            const duplicateSet = new Set(selected);
            const out = await PDFDocument.create();
            for (let i = 0; i < total; i++) {
                const [page] = await out.copyPages(src, [i]); out.addPage(page);
                if (duplicateSet.has(i)) { const [copy] = await out.copyPages(src, [i]); out.addPage(copy); }
            }
            return { blob: await pdfDocToBlob(out), fileName: `${baseName}-duplicado.pdf`, originalBytes, message: `${selected.length} página(s) duplicada(s).` };
        }
        if (tool === "oddEven") {
            const odd = src.getPageIndices().filter((index) => (index + 1) % 2 === 1);
            const even = src.getPageIndices().filter((index) => (index + 1) % 2 === 0);
            const mode = options.oddEven || "split";
            const create = async (indexes, suffix) => {
                const out = await PDFDocument.create(); const copied = await out.copyPages(src, indexes); copied.forEach((page) => out.addPage(page));
                return { fileName: `${baseName}-${suffix}.pdf`, blob: await pdfDocToBlob(out) };
            };
            if (mode === "split") {
                const output = [];
                if (odd.length) output.push(await create(odd, "impares"));
                if (even.length) output.push(await create(even, "pares"));
                return { files: output, originalBytes, message: `Gerados ${output.length} arquivos de páginas ímpares e pares.` };
            }
            const indexes = mode === "even" ? even : odd;
            if (!indexes.length) throw new Error("O documento não possui páginas nessa seleção.");
            const result = await create(indexes, mode === "even" ? "pares" : "impares");
            return { blob: result.blob, fileName: result.fileName, originalBytes, message: `${indexes.length} página(s) extraída(s).` };
        }
        if (tool === "number") {
            const font = await src.embedFont(StandardFonts.Helvetica);
            const format = options.numberFormat || "page_of", position = options.numberPosition || "bottom-center", startAt = Math.max(1, Number(options.numberStart || 1));
            src.getPages().forEach((page, index) => {
                const number = startAt + index;
                const label = toPdfSafeText(format === "plain" ? String(number) : format === "dash" ? `- ${number} -` : `Pagina ${number} de ${total + startAt - 1}`);
                const size = 10, { width, height } = page.getSize(), textWidth = font.widthOfTextAtSize(label, size);
                let x = (width - textWidth) / 2, y = 16;
                if (position === "bottom-left") x = 28;
                if (position === "bottom-right") x = width - textWidth - 28;
                if (position === "top-center") y = height - 22;
                page.drawText(label, { x, y, size, font, color: rgb(0.25, 0.28, 0.32) });
            });
            return { blob: await pdfDocToBlob(src), fileName: `${baseName}-numerado.pdf`, originalBytes, message: `${total} páginas numeradas.` };
        }
        if (tool === "watermark") {
            const text = toPdfSafeText(String(options.watermarkText || "CONFIDENCIAL").trim() || "CONFIDENCIAL");
            const size = Math.max(18, Math.min(96, Number(options.watermarkSize || 48)));
            const opacity = Math.max(0.08, Math.min(0.55, Number(options.watermarkOpacity || 0.18)));
            const font = await src.embedFont(StandardFonts.HelveticaBold);
            const shade = 0.82 + (1 - opacity) * 0.12;
            for (const page of src.getPages()) {
                const { width, height } = page.getSize(), textWidth = font.widthOfTextAtSize(text, size);
                page.drawText(text, { x: (width - textWidth) / 2, y: height / 2 - size / 3, size, font, color: rgb(shade, shade * 0.85, shade * 0.85), rotate: degrees(45) });
            }
            return { blob: await pdfDocToBlob(src), fileName: `${baseName}-marca-dagua.pdf`, originalBytes, message: `Marca d'água aplicada em ${total} páginas.` };
        }
        if (tool === "stamp") {
            const text = toPdfSafeText(String(options.stampText || "COPIA").trim() || "COPIA");
            const position = options.stampPosition || "top-right", font = await src.embedFont(StandardFonts.HelveticaBold), size = 12;
            for (const page of src.getPages()) {
                const { width, height } = page.getSize(), tw = font.widthOfTextAtSize(text, size);
                let x = width - tw - 28, y = height - 28;
                if (position === "top-left") x = 28;
                if (position === "bottom-left") { x = 28; y = 20; }
                if (position === "bottom-right") y = 20;
                if (position === "center") { x = (width - tw) / 2; y = height / 2; }
                page.drawRectangle({ x: x - 6, y: y - 4, width: tw + 12, height: size + 8, color: rgb(1, 0.95, 0.9), borderColor: rgb(0.64, 0.22, 0.14), borderWidth: 1 });
                page.drawText(text, { x, y, size, font, color: rgb(0.64, 0.22, 0.14) });
            }
            return { blob: await pdfDocToBlob(src), fileName: `${baseName}-carimbo.pdf`, originalBytes, message: `Carimbo aplicado em ${total} páginas.` };
        }
        if (tool === "headerFooter") {
            const header = toPdfSafeText(String(options.headerText || "").trim()), footer = toPdfSafeText(String(options.footerText || "").trim());
            if (!header && !footer) throw new Error("Informe um cabeçalho e/ou rodapé.");
            const font = await src.embedFont(StandardFonts.Helvetica), size = 9;
            for (const page of src.getPages()) {
                const { width, height } = page.getSize();
                if (header) { const tw = font.widthOfTextAtSize(header, size); page.drawText(header, { x: (width - tw) / 2, y: height - 20, size, font, color: rgb(0.3,0.33,0.38) }); }
                if (footer) { const tw = font.widthOfTextAtSize(footer, size); page.drawText(footer, { x: (width - tw) / 2, y: 18, size, font, color: rgb(0.3,0.33,0.38) }); }
            }
            return { blob: await pdfDocToBlob(src), fileName: `${baseName}-cabecalho-rodape.pdf`, originalBytes, message: `Cabeçalho/rodapé aplicados em ${total} páginas.` };
        }

        if (["extract", "organize", "remove", "rotate", "split"].includes(tool)) {
            let indexes = pagesText ? parsePages(pagesText, total) : src.getPageIndices();
            if (!indexes.length) throw new Error(`Informe páginas válidas (1 até ${total}).`);
            if (tool === "remove") {
                const removeSet = new Set(indexes); indexes = src.getPageIndices().filter((index) => !removeSet.has(index));
                if (!indexes.length) throw new Error("Não é possível remover todas as páginas.");
            }
            if (tool === "split") {
                const output = [];
                for (const index of indexes) {
                    const out = await PDFDocument.create(); const [page] = await out.copyPages(src, [index]); out.addPage(page);
                    output.push({ fileName: `${baseName}-pagina-${String(index + 1).padStart(3, "0")}.pdf`, blob: await pdfDocToBlob(out) });
                }
                return { files: output, originalBytes, message: `${output.length} arquivos gerados.` };
            }
            const out = await PDFDocument.create(); const copied = await out.copyPages(src, indexes);
            copied.forEach((page) => { if (tool === "rotate") page.setRotation(degrees((page.getRotation().angle + Number(options.rotation || 90)) % 360)); out.addPage(page); });
            const names = { extract: "paginas-extraidas.pdf", organize: "pdf-reorganizado.pdf", remove: "pdf-sem-paginas.pdf", rotate: "pdf-girado.pdf" };
            return { blob: await pdfDocToBlob(out), fileName: names[tool], originalBytes, message: `PDF gerado com ${indexes.length} página(s).` };
        }
        throw new Error(`Ferramenta local não implementada: ${tool}`);
    }

    async function splitPdfByMaxSizeLocal(file, src, maxBytes, quality = 0.68) {
        if (!Number.isFinite(maxBytes) || maxBytes < 200 * 1024) throw new Error("O limite mínimo é 0,2 MB.");
        const { PDFDocument } = window.PDFLib;
        const total = src.getPageCount();
        const baseName = file.name.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9À-ÿ._ -]/g, "-") || "documento";
        const originalData = await file.arrayBuffer();
        const buildRange = async (start, end) => {
            const out = await PDFDocument.create(); const indexes = []; for (let i = start; i <= end; i++) indexes.push(i);
            const copied = await out.copyPages(src, indexes); copied.forEach((page) => out.addPage(page));
            return pdfDocToBlob(out);
        };
        const output = [];
        let start = 0, part = 1, rasterized = 0;
        while (start < total) {
            showPdfToolProgress(25 + Math.round((start / total) * 60), `Calculando parte ${part}...`);
            let bestEnd = start, bestBlob = await buildRange(start, start);
            if (bestBlob.size > maxBytes) {
                bestBlob = await rasterizePdfPageUnderLimit(originalData.slice(0), start, maxBytes, quality);
                rasterized += 1;
                if (bestBlob.size > maxBytes) throw new Error(`A página ${start + 1} não pôde ser reduzida abaixo do limite escolhido.`);
            } else {
                let low = start + 1, high = total - 1;
                while (low <= high) {
                    const mid = (low + high) >> 1, candidate = await buildRange(start, mid);
                    if (candidate.size <= maxBytes) { bestEnd = mid; bestBlob = candidate; low = mid + 1; }
                    else high = mid - 1;
                }
            }
            output.push({ fileName: `${baseName}_parte_${String(part).padStart(2, "0")}.pdf`, blob: bestBlob });
            start = bestEnd + 1; part += 1;
        }
        const largest = Math.max(...output.map((item) => item.blob.size));
        return { files: output, originalBytes: file.size, message: `${output.length} parte(s) gerada(s), todas com até ${formatBytes(maxBytes)}. Maior parte: ${formatBytes(largest)}.${rasterized ? ` ${rasterized} página(s) pesada(s) foram otimizadas.` : ""}` };
    }

    async function rasterizePdfPageUnderLimit(arrayBuffer, pageIndex, maxBytes, preferredQuality) {
        if (!window.pdfjsLib) throw new Error("Módulo de renderização PDF não carregado. Recarregue a página.");
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const loading = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loading.promise;
        const page = await pdf.getPage(pageIndex + 1);
        const baseViewport = page.getViewport({ scale: 1 });
        const scales = [1.5, 1.25, 1, 0.85, 0.7, 0.55, 0.42, 0.32];
        const qualities = [preferredQuality, 0.62, 0.52, 0.42, 0.32, 0.24].map((value) => Math.max(0.18, Math.min(0.9, Number(value) || 0.68)));
        let smallest = null;
        for (const scale of scales) {
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(viewport.width)); canvas.height = Math.max(1, Math.round(viewport.height));
            const context = canvas.getContext("2d", { alpha: false }); context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: context, viewport }).promise;
            for (const q of qualities) {
                const jpeg = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Falha ao otimizar página.")), "image/jpeg", q));
                const out = await window.PDFLib.PDFDocument.create(); const image = await out.embedJpg(await jpeg.arrayBuffer());
                const outPage = out.addPage([baseViewport.width, baseViewport.height]); outPage.drawImage(image, { x: 0, y: 0, width: baseViewport.width, height: baseViewport.height });
                const blob = await pdfDocToBlob(out);
                if (!smallest || blob.size < smallest.size) smallest = blob;
                if (blob.size <= maxBytes) { try { await pdf.destroy(); } catch (_) {} return blob; }
            }
        }
        try { await pdf.destroy(); } catch (_) {}
        return smallest;
    }

    async function loadPdfDocument(arrayBuffer) {
        const { PDFDocument } = window.PDFLib;
        try {
            return await PDFDocument.load(arrayBuffer, { ignoreEncryption: true, updateMetadata: false });
        } catch (error) {
            throw new Error("PDF inválido, corrompido ou protegido de forma incompatível.");
        }
    }

    async function pdfDocToBlob(pdfDoc) {
        const bytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
        return new Blob([bytes], { type: "application/pdf" });
    }

    function showPdfToolProgress(pct, text) {
        const box = $("#pdfToolProgress");
        const bar = $("#pdfToolProgressBar");
        const label = $("#pdfToolProgressLabel");
        const percent = $("#pdfToolProgressPct");
        const track = box?.querySelector?.('[role="progressbar"]');
        const value = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
        if (box) box.classList.remove("is-hidden");
        if (bar) {
            bar.style.width = `${value}%`;
            bar.dataset.pct = String(value);
        }
        if (percent) percent.textContent = `${value}%`;
        if (track) track.setAttribute("aria-valuenow", String(value));
        if (text && label) label.textContent = text;
    }

    function hidePdfToolProgress(keepIfComplete = false) {
        const box = $("#pdfToolProgress");
        const bar = $("#pdfToolProgressBar");
        const pct = Number(bar?.dataset?.pct || 0);
        if (!box) return;
        if (keepIfComplete && pct >= 100) return;
        box.classList.add("is-hidden");
    }

    function showPdfToolStats({ originalBytes, outputBytes, strategy, message }) {
        const box = $("#pdfToolStats");
        if (!box) return;
        const parts = [];
        if (originalBytes != null) parts.push(`<span><b>Original:</b> ${formatBytes(originalBytes)}</span>`);
        if (outputBytes != null) parts.push(`<span><b>Resultado:</b> ${formatBytes(outputBytes)}</span>`);
        if (originalBytes && outputBytes) {
            const saved = originalBytes - outputBytes;
            const ratio = Math.round((saved / originalBytes) * 100);
            parts.push(`<span><b>Economia:</b> ${formatBytes(Math.max(0, saved))} (${ratio}%)</span>`);
        }
        if (strategy) parts.push(`<span><b>Modo:</b> ${escapeHtml(String(strategy))}</span>`);
        if (message) parts.push(`<span class="wide">${escapeHtml(message)}</span>`);
        box.innerHTML = parts.join("");
        box.classList.toggle("is-hidden", !parts.length);
    }

    function hidePdfToolStats() {
        const box = $("#pdfToolStats");
        if (box) {
            box.classList.add("is-hidden");
            box.innerHTML = "";
        }
    }

    function clearPdfToolResult() {
        const panel = $("#pdfToolResult");
        const frame = $("#pdfToolResultFrame");
        if (state.pdfToolResultUrl) {
            try { URL.revokeObjectURL(state.pdfToolResultUrl); } catch (_) {}
        }
        state.pdfToolResultUrl = null;
        state.pdfToolResultBase64 = "";
        state.pdfToolResultFileName = "";
        if (frame) frame.removeAttribute("src");
        if (panel) panel.classList.add("is-hidden");
    }

    function showPdfToolResult(base64, fileName, meta = {}) {
        const panel = $("#pdfToolResult");
        const frame = $("#pdfToolResultFrame");
        const title = $("#pdfToolResultTitle");
        const nameEl = $("#pdfToolResultName");
        if (!panel || !frame) return;

        if (state.pdfToolResultUrl) {
            try { URL.revokeObjectURL(state.pdfToolResultUrl); } catch (_) {}
        }

        const blob = base64ToBlob(base64, "application/pdf");
        const url = URL.createObjectURL(blob);
        state.pdfToolResultUrl = url;
        state.pdfToolResultBase64 = String(base64 || "").replace(/^data:[^;]+;base64,/, "");
        state.pdfToolResultFileName = fileName || "resultado.pdf";

        if (title) title.textContent = "PDF processado com sucesso";
        if (nameEl) nameEl.textContent = state.pdfToolResultFileName;
        frame.src = url;
        panel.classList.remove("is-hidden");
        showPdfToolStats({
            originalBytes: meta.originalBytes,
            outputBytes: meta.outputBytes || blob.size,
            strategy: meta.strategy,
            message: meta.message,
        });
        setTimeout(() => panel.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }

    async function presentPdfToolBlob(blob, fileName, meta = {}) {
        const base64 = await blobToBase64(blob, true);
        showPdfToolResult(base64, fileName, {
            originalBytes: meta.originalBytes,
            outputBytes: blob.size,
            message: meta.message,
            strategy: "local",
        });
    }

    function formatBytes(bytes) {
        const n = Number(bytes) || 0;
        if (n < 1024) return `${n} B`;
        if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
        return `${(n / (1024 * 1024)).toFixed(2)} MB`;
    }

    function estimateBase64Bytes(base64) {
        const clean = String(base64 || "").replace(/^data:[^;]+;base64,/, "");
        const padding = (clean.match(/=+$/) || [""])[0].length;
        return Math.max(0, Math.floor((clean.length * 3) / 4) - padding);
    }

    function toPdfSafeText(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
    }

    function renderSupport() {
        refs.content.innerHTML = `
            <div class="support-shell">
                <div class="support-contact-row">
                    <article class="support-contact-card"><span><i data-lucide="calendar-clock"></i></span><div><strong>Horário de atendimento</strong><small>Seg. a sex., 08h às 18h</small></div></article>
                    <article class="support-contact-card"><span><i data-lucide="mail"></i></span><div><strong>E-mail</strong><small>kaua.dev@outlook.com.br</small></div></article>
                    <article class="support-contact-card"><span><i data-lucide="phone"></i></span><div><strong>Telefone</strong><small>(75) 99117-9224</small></div></article>
                </div>
                <article class="panel support-form-card">
                    <h2>Envie sua mensagem</h2>
                    <p>Preencha os dados abaixo e responderemos assim que possível.</p>
                    <form id="supportForm" class="form-grid">
                        <label class="field"><span>Nome</span><input name="name" value="${escapeAttr(state.user?.name || "")}" ${state.user ? "readonly" : ""}></label>
                        <label class="field"><span>E-mail</span><input name="email" type="email" value="${escapeAttr(state.user?.email || "")}" ${state.user ? "readonly" : ""}></label>
                        <label class="field wide"><span>Assunto</span><input name="subject" placeholder="Como podemos ajudar?"></label>
                        <label class="field wide"><span>Mensagem</span><textarea name="message" required placeholder="Descreva sua dúvida com detalhes..."></textarea></label>
                        <label class="field wide"><span>Anexo opcional</span><input name="attachment" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"></label>
                        <div class="field wide"><p id="supportMessage" class="message"></p></div>
                        <div class="field wide action-row"><button class="primary-button" type="submit"><i data-lucide="send"></i> Enviar mensagem</button><button class="ghost-button" type="button" data-load-support>Atualizar histórico</button></div>
                    </form>
                </article>
                <article class="panel"><div class="dashboard-section-head"><div><h2>Histórico</h2><p>Acompanhe suas solicitações.</p></div></div><div id="supportList">${renderMessageList(state.supportMessages)}</div></article>
            </div>`;
    }

    async function submitSupport(event) {
        const form = event.target;
        const msg = $("#supportMessage");
        setFormLoading(form, true);
        setMessage(msg, "Enviando...", "");
        try {
            const fd = new FormData(form);
            const file = fd.get("attachment");
            const body = { name: fd.get("name"), email: fd.get("email"), message: fd.get("message") };
            if (file && file.size) body.attachment = { name: file.name, type: file.type, data: await blobToBase64(file, true) };
            const data = await apiRequest("/api/support/messages", { method: "POST", body });
            setMessage(msg, data.message || "Mensagem enviada.", "success");
            form.reset();
            await loadSupportMessages();
            renderSupport();
        } catch (error) {
            setMessage(msg, translateError(error), "error");
        } finally { setFormLoading(form, false); }
    }

    async function loadSupportMessages() {
        const data = await apiRequest("/api/support/messages");
        state.supportMessages = data.messages || [];
    }




    async function createPix(plan) {
        const box = $("#billingResult");
        box.innerHTML = `<p class="message">Gerando Pix...</p>`;
        try {
            const data = await apiRequest("/api/billing/pix", { method: "POST", body: { plan, mode: "change" } });
            const img = data.pix?.qrCodeImage ? `<img src="${escapeAttr(data.pix.qrCodeImage)}" alt="QR Code Pix">` : `<canvas id="pixQrCanvas"></canvas>`;
            box.innerHTML = `<article class="glass-card"><h3>Pix gerado</h3><p>${escapeHtml(data.message || "Pague para liberar o acesso.")}</p>${img}<label class="field"><span>Copia e cola</span><textarea readonly>${escapeHtml(data.pix?.qrCode || "")}</textarea></label><p>Status: ${escapeHtml(data.payment?.status || "pending")}</p></article>`;
            if (!data.pix?.qrCodeImage && data.pix?.qrCode && window.QRCode) window.QRCode.toCanvas($("#pixQrCanvas"), data.pix.qrCode);
        } catch (error) { box.innerHTML = `<p class="message error">${escapeHtml(translateError(error))}</p>`; }
    }

    function renderAdminUserWizard() {
        if (!state.adminUserModalOpen) return "";
        const step = Math.max(0, Math.min(4, Number(state.adminUserWizardStep || 0)));
        const titles = ["Dados de acesso", "Plano e conta", "Limites de documentos", "Ferramentas PDF", "Modelos permitidos"];
        const stepClass = (n) => `admin-user-wizard-step ${step === n ? "is-active" : ""}`;
        return `<div class="admin-user-modal-overlay" data-close-admin-user-modal-backdrop>
            <section class="admin-user-modal" role="dialog" aria-modal="true" aria-labelledby="adminUserModalTitle">
                <header class="admin-user-modal-header"><div><p class="eyebrow">Cadastro guiado</p><h2 id="adminUserModalTitle">${state.adminEditingUserId ? "Editar usuário" : "Cadastrar usuário"}</h2><p>Etapa ${step + 1} de 5 · ${titles[step]}</p></div><button type="button" class="document-modal-close" data-close-admin-user-modal aria-label="Fechar">×</button></header>
                <form id="adminUserForm" class="admin-user-wizard-form">
                    <input type="hidden" name="uid" id="adminUid" value="${escapeAttr(state.adminEditingUserId || "")}">
                    <nav class="admin-user-wizard-progress">${titles.map((t,i)=>`<span class="${i===step?'is-active':i<step?'is-done':''}"><b>${i+1}</b><em>${escapeHtml(t)}</em></span>`).join('')}</nav>
                    <div class="admin-user-wizard-body">
                        <section class="${stepClass(0)}" data-admin-wizard-panel="0"><div class="form-grid"><label class="field"><span>Nome</span><input name="name" required></label><label class="field"><span>E-mail</span><input name="email" type="email" required></label><label class="field wide"><span>Senha</span><input name="password" type="password" placeholder="Obrigatória ao criar; deixe vazia para manter ao editar"></label></div></section>
                        <section class="${stepClass(1)}" data-admin-wizard-panel="1"><div class="form-grid"><label class="field"><span>Plano</span><select name="plan">${PLAN_OPTIONS.map((p)=>`<option value="${p.id}">${escapeHtml(p.label)}</option>`).join('')}</select></label><label class="field"><span>Status</span><select name="status"><option value="active">Ativo</option><option value="blocked">Bloqueado</option><option value="expired">Expirado</option></select></label><label class="field wide"><span>Tipo de conta</span><select name="isAdmin"><option value="no">Usuário</option><option value="yes">Administrador</option></select></label></div></section>
                        <section class="${stepClass(2)}" data-admin-wizard-panel="2"><div class="form-grid"><label class="field"><span>Gerações diárias totais</span><input name="dailyDocumentLimit" type="number" value="30" min="1" max="999"></label><label class="field"><span>Renovar cota diariamente</span><select name="dailyQuotaRenewalEnabled"><option value="yes">Sim, renovar todos os dias</option><option value="no">Não renovar automaticamente</option></select></label><label class="field wide"><span>Observações administrativas</span><textarea name="notes" rows="4"></textarea></label></div></section>
                        <section class="${stepClass(3)}" data-admin-wizard-panel="3"><div class="form-grid"><label class="field"><span>Ferramentas PDF</span><select name="allowPdfTools"><option value="yes">Liberadas</option><option value="no">Bloqueadas</option></select></label><label class="field"><span>Limite diário de PDF</span><input name="pdfToolDailyLimit" type="number" value="5" min="1"></label></div></section>
                        <section class="${stepClass(4)}" data-admin-wizard-panel="4"><fieldset class="field wide permission-box admin-permission-box"><legend>Modelos permitidos</legend><div class="permission-choice-row"><label class="permission-mode"><input type="radio" name="documentAccessMode" value="all" checked> Todos os modelos</label><label class="permission-mode"><input type="radio" name="documentAccessMode" value="selected"> Selecionar modelos</label></div><div class="permission-toolbar"><button type="button" class="ghost-button" data-admin-docs-all>Marcar todos</button><button type="button" class="ghost-button" data-admin-docs-none>Desmarcar</button></div><div class="permission-grid">${DOCS.map((doc)=>`<label><input type="checkbox" name="allowedDocumentTypes" value="${escapeAttr(doc.id)}"><span>${escapeHtml(doc.title)}</span></label>`).join('')}</div></fieldset><p id="adminMessage" class="message"></p></section>
                    </div>
                    <footer class="admin-user-wizard-actions"><button type="button" class="ghost-button" data-close-admin-user-modal>Cancelar</button><div><button type="button" class="secondary-button" data-admin-wizard-prev ${step===0?'hidden':''}>Voltar</button><button type="button" class="primary-button" data-admin-wizard-next ${step===4?'hidden':''}>Próximo</button><button type="submit" class="primary-button" data-admin-wizard-submit ${step!==4?'hidden':''}><i data-lucide="save"></i> Finalizar e salvar</button></div></footer>
                </form>
            </section>
        </div>`;
    }

    function syncAdminUserWizardUI() {
        const modal = document.querySelector(".admin-user-modal");
        if (!modal) return;
        const step = Math.max(0, Math.min(4, Number(state.adminUserWizardStep || 0)));
        modal.querySelectorAll("[data-admin-wizard-panel]").forEach((panel) => panel.classList.toggle("is-active", Number(panel.dataset.adminWizardPanel) === step));
        modal.querySelectorAll(".admin-user-wizard-progress span").forEach((item, index) => { item.classList.toggle("is-active", index === step); item.classList.toggle("is-done", index < step); });
        const prev = modal.querySelector("[data-admin-wizard-prev]");
        const next = modal.querySelector("[data-admin-wizard-next]");
        const submit = modal.querySelector("[data-admin-wizard-submit]");
        if (prev) prev.hidden = step === 0;
        if (next) next.hidden = step === 4;
        if (submit) submit.hidden = step !== 4;
        const subtitle = modal.querySelector(".admin-user-modal-header p:last-child");
        const titles = ["Dados de acesso", "Plano e conta", "Limites de documentos", "Ferramentas PDF", "Modelos permitidos"];
        if (subtitle) subtitle.textContent = `Etapa ${step + 1} de 5 · ${titles[step]}`;
    }

    async function renderAdmin() {
        if (!isAdmin()) { refs.content.innerHTML = `<p class="message error">Apenas administradores.</p>`; return; }
        const allowedTabs = new Set(["users", "support", "billing", "system"]);
        if (!allowedTabs.has(state.adminTab)) state.adminTab = "users";
        const tab = state.adminTab;
        const tabButton = (id,label,icon)=>`<button type="button" class="${tab===id?'is-active':''}" data-admin-tab="${id}"><i data-lucide="${icon}"></i><span>${label}</span></button>`;
        let body="";
        if (tab === "users") {
            body = `<article class="admin-card admin-user-list-card admin-users-only-card"><div class="admin-card-heading"><div><p class="eyebrow">Usuários e atividades</p><h2>Contas cadastradas</h2><p>Consulte limites, último acesso, IP e histórico de geração.</p></div><div class="admin-heading-actions"><button class="secondary-button" data-load-admin ${state.adminUsersLoading?'disabled':''}><i data-lucide="refresh-cw"></i> ${state.adminUsersLoading?'Carregando...':'Atualizar'}</button><button class="primary-button" data-open-admin-user-modal><i data-lucide="user-plus"></i> Cadastrar usuário</button></div></div><div id="adminUsersArea">${renderAdminUsers()}</div></article>${renderAdminHistoryPanel()}${renderAdminUserWizard()}`;
        } else if (tab === "support") {
            body = `<article class="admin-card admin-support-panel"><div class="admin-card-heading"><div><p class="eyebrow">Atendimento</p><h2>Conversas dos clientes</h2><p>Todos os usuários podem abrir atendimento; somente administradores visualizam esta central.</p></div><button class="secondary-button" data-load-admin-support><i data-lucide="refresh-cw"></i> Atualizar</button></div><div id="adminSupportArea">${renderMessageList(state.adminSupportMessages,true)}</div></article>`;
        } else if (tab === "billing") {
            body = `<div class="admin-billing-grid">${PAYMENT_PLANS.filter((plan)=>["basic30","proMax365"].includes(plan.id)).map((plan)=>`<article class="admin-card admin-plan-card"><span><i data-lucide="badge-dollar-sign"></i></span><p class="eyebrow">${plan.id==="basic30"?'Mensal':'Anual'}</p><h2>${escapeHtml(plan.label)}</h2><strong>${escapeHtml(plan.price)}</strong><p>Checkout público com Pix, cartão e boleto pelo Mercado Pago.</p></article>`).join('')}</div>`;
        } else {
            body = `<div class="admin-system-grid"><article class="admin-card"><p class="eyebrow">Auditoria</p><h2>Eventos gravados no D1</h2><ul class="admin-check-list"><li><i data-lucide="check-circle-2"></i> Login com data, hora e IP.</li><li><i data-lucide="check-circle-2"></i> Geração de documentos e uso da IA.</li><li><i data-lucide="check-circle-2"></i> Alterações administrativas e pagamentos.</li></ul></article><article class="admin-card"><p class="eyebrow">Catálogo</p><h2>${DOCS.length} modelos integrados</h2><p>Os documentos gerados pela IA usam os arquivos DOCX originais.</p></article></div>`;
        }
        refs.content.innerHTML = `<section class="admin-shell"><nav class="admin-tabs admin-tabs-v2" aria-label="Seções administrativas">${tabButton("users","Usuários","users")}${tabButton("support","Atendimento","messages-square")}${tabButton("billing","Planos e pagamentos","badge-dollar-sign")}${tabButton("system","Sistema","settings-2")}</nav><div class="admin-tab-content">${body}</div></section>`;
        if (tab === "users" && !state.adminUsersLoaded && !state.adminUsersLoading) queueMicrotask(()=>loadAdminUsers({render:true}).catch(()=>{}));
        if (tab === "support" && !state.adminSupportMessages.length) loadAdminSupport().catch(()=>{});
        if (tab === "system") setTimeout(()=>window.DocSpaceProduct?.onAdminRendered?.(refs.content),0);
        initIcons();
    }

    function renderAdminUsersCompact() {
        if (!state.adminUsers.length) return `<p class="message">Carregando usuários...</p>`;
        return `<div class="admin-compact-users">${state.adminUsers.slice(0, 6).map((user) => `<div><span class="profile-avatar">${escapeHtml(initials(user.name || user.email || "DS"))}</span><span><strong>${escapeHtml(user.name || "Usuário")}</strong><small>${escapeHtml(user.email || "")}</small></span><em class="status-pill ${user.status === "active" ? "" : "status-warning"}">${escapeHtml(accessStatusLabel(user.status))}</em></div>`).join("")}</div>`;
    }



    function renderAdminUsers() {
        if (state.adminUsersLoading) {
            return `<div class="admin-users-state is-loading"><span class="admin-loading-spinner" aria-hidden="true"></span><div><strong>Carregando contas...</strong><p>Consultando os usuários cadastrados no Cloudflare D1.</p></div></div>`;
        }
        if (state.adminUsersError) {
            return `<div class="admin-users-state is-error"><i data-lucide="triangle-alert"></i><div><strong>Não foi possível carregar os usuários</strong><p>${escapeHtml(state.adminUsersError)}</p><button type="button" class="secondary-button" data-load-admin>Tentar novamente</button></div></div>`;
        }
        if (!state.adminUsersLoaded) {
            return `<div class="admin-users-state"><span class="admin-loading-spinner" aria-hidden="true"></span><div><strong>Preparando a lista...</strong><p>A consulta será iniciada automaticamente.</p></div></div>`;
        }
        if (!state.adminUsers.length) {
            return `<div class="admin-users-state"><i data-lucide="users"></i><div><strong>Nenhuma conta retornada</strong><p>O banco respondeu corretamente, mas não trouxe usuários. Confira o D1 vinculado ao Worker.</p><button type="button" class="secondary-button" data-load-admin>Consultar novamente</button></div></div>`;
        }
        return `<div class="admin-users-count"><strong>${state.adminUsers.length}</strong> conta${state.adminUsers.length === 1 ? "" : "s"} cadastrada${state.adminUsers.length === 1 ? "" : "s"}</div><div class="table-wrap admin-users-table"><table><thead><tr><th>Usuário</th><th>Plano</th><th>Cotas</th><th>Último acesso</th><th>Ações</th></tr></thead><tbody>${state.adminUsers.map((u) => { const allowed = Array.isArray(u.allowedDocumentTypes) ? u.allowedDocumentTypes : Array.isArray(u.allowed_document_types) ? u.allowed_document_types : []; return `<tr><td><strong>${escapeHtml(u.name || "Sem nome")}</strong><br><small>${escapeHtml(u.email || "")}</small></td><td>${escapeHtml(u.planLabel || u.plan_label || u.plan || "") }<br><small>${escapeHtml(accessStatusLabel(u.status))} · ${u.isAdmin || u.is_admin ? "Administrador" : "Usuário"}</small></td><td><strong>${Number(u.dailyDocumentLimit ?? u.daily_document_limit ?? 0)} gerações totais</strong><br><small>${u.dailyQuotaRenewalEnabled ?? u.daily_quota_renewal_enabled ? "renovação diária" : "sem renovação automática"}<br>PDF: ${(u.allowPdfTools ?? u.allow_pdf_tools) ? `${Number(u.pdfToolDailyLimit ?? u.pdf_tool_daily_limit ?? 0)}/dia` : "bloqueado"}<br>Modelos: ${allowed.length ? `${allowed.length} selecionado(s)` : "todos"}</small></td><td>${u.lastLoginAt || u.last_login_at ? `<strong>${escapeHtml(formatDateTime(u.lastLoginAt || u.last_login_at))}</strong>` : "Nunca"}</td><td class="actions-cell"><button data-edit-user="${escapeAttr(u.id)}">Editar</button><button data-admin-action="${escapeAttr(u.id)}" data-action="${u.status === "blocked" ? "unblock" : "block"}">${u.status === "blocked" ? "Liberar" : "Bloquear"}</button><button data-admin-action="${escapeAttr(u.id)}" data-action="renewCurrent">Renovar plano</button><button data-admin-action="${escapeAttr(u.id)}" data-action="resetDocumentQuota">Zerar cota</button><button class="primary-button" data-user-history="${escapeAttr(u.id)}">Histórico</button></td></tr>`; }).join("")}</tbody></table></div>`;
    }

    function adminActionLabel(action) {
        const labels = { login: "Entrou no sistema", logout: "Saiu do sistema", generate_document: "Gerou documento", use_pdf_tool: "Usou ferramenta PDF", process_pdf_tool: "Processou PDF", preview_pdf: "Gerou prévia PDF", ai_assist: "Usou a IA", ai_draft: "Pediu geração à IA", "ai_extract-fields": "IA leu documentos", ai_review: "IA revisou conteúdo", ai_export_pdf: "Exportou PDF pela IA", update_user: "Conta alterada", create_user: "Conta criada", mercadopago_payment_approved: "Pagamento aprovado", resetDocumentQuota: "Cota de documentos renovada" };
        return labels[action] || String(action || "Evento").replace(/_/g, " ");
    }

    function renderAdminHistoryPanel() {
        if (!state.adminHistoryUser && !state.adminHistoryLoading) return "";
        const user = state.adminHistoryUser || {};
        return `<article class="admin-card admin-history-card"><div class="admin-card-heading"><div><p class="eyebrow">Auditoria do usuário</p><h2>${escapeHtml(user.name || user.email || "Carregando...")}</h2><p>${escapeHtml(user.email || "")}</p></div><button type="button" class="ghost-button" data-close-user-history><i data-lucide="x"></i> Fechar</button></div>${state.adminHistoryLoading ? `<p class="message">Carregando histórico...</p>` : state.adminHistory.length ? `<div class="admin-history-list">${state.adminHistory.map((item) => `<article><span class="admin-history-icon"><i data-lucide="activity"></i></span><div><strong>${escapeHtml(adminActionLabel(item.action))}</strong><small>${escapeHtml(formatDateTime(item.createdAt || item.created_at))}</small><p>${item.details?.documentType ? `Documento: ${escapeHtml(item.details.documentType)}` : item.details?.toolType ? `Ferramenta: ${escapeHtml(item.details.toolType)}` : ""}</p><em>IP: ${escapeHtml(item.ipAddress || item.details?.ipAddress || "não informado")} · ${escapeHtml(item.userAgent || item.details?.userAgent || "navegador não informado")}</em></div></article>`).join("")}</div>` : `<p class="message">Nenhum evento encontrado.</p>`}</article>`;
    }

    async function loadAdminUsers(options = {}) {
        if (state.adminUsersLoading && !options.force) return state.adminUsers;
        state.adminUsersLoading = true;
        state.adminUsersError = "";
        updateAdminUsersArea();
        try {
            const separator = "/api/admin/users".includes("?") ? "&" : "?";
            const data = await apiRequest(`/api/admin/users${separator}_=${Date.now()}`, { cache: "no-store" });
            const users = Array.isArray(data) ? data : Array.isArray(data?.users) ? data.users : null;
            if (!users) {
                throw new Error("O Worker respondeu em um formato antigo ou retornou uma página HTML. Publique o backend-worker da mesma versão do frontend.");
            }
            state.adminUsers = users;
            state.adminUsersLoaded = true;
            return users;
        } catch (error) {
            state.adminUsersLoaded = false;
            state.adminUsersError = translateAdminUsersError(error);
            throw error;
        } finally {
            state.adminUsersLoading = false;
            updateAdminUsersArea();
        }
    }

    function updateAdminUsersArea() {
        if (state.view !== "admin" || state.adminTab !== "users") return;
        const area = document.querySelector("#adminUsersArea");
        if (area) {
            area.innerHTML = renderAdminUsers();
            initIcons();
        }
        const button = document.querySelector("[data-load-admin]");
        if (button) {
            button.disabled = state.adminUsersLoading;
            button.innerHTML = `<i data-lucide="refresh-cw"></i> ${state.adminUsersLoading ? "Carregando..." : "Atualizar"}`;
            initIcons();
        }
    }

    function translateAdminUsersError(error) {
        const status = Number(error?.status || 0);
        const raw = String(error?.data?.message || error?.message || "Erro desconhecido.");
        if (status === 401) return "Sua sessão expirou. Saia e entre novamente com a conta administradora.";
        if (status === 403) return "A conta atual não possui permissão de administrador.";
        if (status === 404) return "A rota /api/admin/users não existe no Worker publicado. Execute PUBLICAR_TUDO_DOCSPACE.bat para atualizar o Worker e o site.";
        if (/formato antigo|página HTML|pagina HTML/i.test(raw)) return raw;
        if (/Failed to fetch|NetworkError|Load failed/i.test(raw)) return "Não foi possível alcançar o Worker. Confira app-config.js, o domínio workers.dev e o CORS.";
        if (/Erro interno da API|no such column|D1/i.test(raw)) return "O Worker não conseguiu consultar o banco D1. Execute PUBLICAR_TUDO_DOCSPACE.bat para atualizar o Worker e executar a migração compatível.";
        return raw;
    }

    async function saveAdminUser(event) {
        const form = event.target;
        const msg = $("#adminMessage");
        const fd = new FormData(form);
        const uid = fd.get("uid");
        const existingUser = uid ? state.adminUsers.find((user) => user.id === uid) : null;
        const body = {
            name: String(fd.get("name") || "").trim(),
            email: String(fd.get("email") || "").trim(),
            password: String(fd.get("password") || ""),
            plan: fd.get("plan"),
            status: fd.get("status"),
            dailyDocumentLimit: Number(fd.get("dailyDocumentLimit") || 30),
            dailyQuotaRenewalEnabled: fd.get("dailyQuotaRenewalEnabled") === "yes",
            allowPdfTools: fd.get("allowPdfTools") === "yes",
            pdfToolDailyLimit: Number(fd.get("pdfToolDailyLimit") || 5),
            pdfToolQuotaRenewalEnabled: true,
            isVerified: Boolean(existingUser?.isVerified ?? existingUser?.is_verified ?? false),
            allowLiquidGlass: Boolean(existingUser?.allowLiquidGlass ?? existingUser?.allow_liquid_glass ?? false),
            allowedDocumentTypes: fd.get("documentAccessMode") === "selected" ? fd.getAll("allowedDocumentTypes").map(String) : [],
            notes: String(fd.get("notes") || "").trim(),
            isAdmin: fd.get("isAdmin") === "yes",
        };
        if (fd.get("documentAccessMode") === "selected" && !body.allowedDocumentTypes.length) {
            setMessage(msg, "Selecione ao menos um documento ou escolha Todos os modelos.", "error");
            return;
        }
        if (uid && !body.password) delete body.password;
        setFormLoading(form, true);
        try {
            const data = uid ? await apiRequest(`/api/admin/users/${encodeURIComponent(uid)}`, { method: "PUT", body }) : await apiRequest("/api/admin/users", { method: "POST", body });
            setMessage(msg, data.message || "Login salvo.", "success");
            form.reset();
            state.adminUserModalOpen = false;
            state.adminUserWizardStep = 0;
            state.adminEditingUserId = "";
            await loadAdminUsers();
            renderAdmin();
        } catch (error) { setMessage(msg, translateError(error), "error"); }
        finally { setFormLoading(form, false); }
    }

    async function runAdminAction(uid, action) {
        try {
            const data = await apiRequest(`/api/admin/users/${encodeURIComponent(uid)}/actions`, { method: "POST", body: { action } });
            toast(data.message || "Ação aplicada.", "success");
            await loadAdminUsers();
            renderAdmin();
        } catch (error) { toast(translateError(error), "error"); }
    }

    function editUser(uid) {
        const user = state.adminUsers.find((u) => u.id === uid);
        if (!user) return;
        state.adminUserModalOpen = true;
        state.adminUserWizardStep = 0;
        state.adminEditingUserId = uid;
        renderAdmin();
        const form = $("#adminUserForm");
        if (!form) return;

        // HTMLFormElement.name conflita com o input name="name" — usar elements.
        setNamedFormValue(form, "uid", user.id || "");
        setNamedFormValue(form, "name", user.name || "");
        setNamedFormValue(form, "email", user.email || "");
        setNamedFormValue(form, "password", "");
        setNamedFormValue(form, "plan", user.plan || "basic30");
        setNamedFormValue(form, "status", user.status || "active");
        setNamedFormValue(form, "dailyDocumentLimit", user.dailyDocumentLimit ?? user.daily_document_limit ?? 30);
        setNamedFormValue(form, "dailyQuotaRenewalEnabled", (user.dailyQuotaRenewalEnabled ?? user.daily_quota_renewal_enabled ?? true) ? "yes" : "no");
        setNamedFormValue(form, "allowPdfTools", (user.allowPdfTools ?? user.allow_pdf_tools) ? "yes" : "no");
        setNamedFormValue(form, "pdfToolDailyLimit", user.pdfToolDailyLimit ?? user.pdf_tool_daily_limit ?? 5);
        setNamedFormValue(form, "isAdmin", (user.isAdmin ?? user.is_admin) ? "yes" : "no");
        const allowedTypes = Array.isArray(user.allowedDocumentTypes) ? user.allowedDocumentTypes : (Array.isArray(user.allowed_document_types) ? user.allowed_document_types : []);
        const selectedMode = allowedTypes.length > 0;
        setNamedFormValue(form, "documentAccessMode", selectedMode ? "selected" : "all");
        form.querySelectorAll('input[name="allowedDocumentTypes"]').forEach((input) => { input.checked = selectedMode && allowedTypes.includes(input.value); });
        setNamedFormValue(form, "notes", user.notes || "");
        form.querySelector('input[name="name"]')?.focus();
    }

    function setNamedFormValue(form, name, value) {
        const field = form?.elements?.namedItem?.(name);
        if (!field) return;
        if (field instanceof RadioNodeList) {
            field.value = String(value ?? "");
            return;
        }
        if ("value" in field) field.value = String(value ?? "");
    }

    async function loadAdminSupport() {
        const data = await apiRequest("/api/admin/support/messages");
        state.adminSupportMessages = data.messages || [];
        renderAdmin();
    }



    function handleContentClick(event) {
        const avatarSelect = event.target.closest("[data-profile-avatar-select]");
        if (avatarSelect) {
            event.preventDefault();
            $("#profileAvatarInput")?.click();
            return;
        }
        const avatarRemove = event.target.closest("[data-profile-avatar-remove]");
        if (avatarRemove) {
            event.preventDefault();
            updateProfileAvatar("").catch((error) => toast(translateError(error), "error"));
            return;
        }
        // Backup: clique direto em Gerar Word/PDF (caso o submit HTML5 seja engolido).
        const generateBtn = event.target.closest("#documentGenerateForm [data-generate-type]");
        if (generateBtn) {
            event.preventDefault();
            generateDocument({
                preventDefault() {},
                stopPropagation() {},
                target: generateBtn,
                submitter: generateBtn,
                currentTarget: generateBtn.closest("#documentGenerateForm"),
            });
            return;
        }
        const stepIndicator = event.target.closest("[data-step-indicator]");
        if (stepIndicator) {
            const form = stepIndicator.closest("form") || $("#documentGenerateForm");
            if (!form) return;
            const target = Number(stepIndicator.dataset.stepIndicator);
            if (!Number.isInteger(target)) return;
            form.dataset.currentStep = String(Math.max(0, target));
            updateDocumentWizard(form);
            return;
        }
        const nextStep = event.target.closest("[data-doc-step-next]");
        if (nextStep) { moveDocumentStep(nextStep.closest("form"), 1); return; }
        const prevStep = event.target.closest("[data-doc-step-prev]");
        if (prevStep) { moveDocumentStep(prevStep.closest("form"), -1); return; }
        const officeAiOpen = event.target.closest("[data-office-ai-open]");
        if (officeAiOpen) { launchOfficeAi(officeAiOpen.dataset.officeAiOpen); return; }
        const officeAiClose = event.target.closest("[data-office-ai-close]");
        if (officeAiClose) { closeOfficeAi(); return; }
        const officeAiBackdrop = event.target.closest("[data-office-ai-backdrop]");
        if (officeAiBackdrop && event.target === officeAiBackdrop) { closeOfficeAi(); return; }
        const officeAiExample = event.target.closest("[data-office-ai-example]");
        if (officeAiExample) {
            state.officeAiPrompt = officeAiExample.dataset.officeAiExample || "";
            const input = $("#officeAiPrompt");
            if (input) { input.value = state.officeAiPrompt; input.focus(); }
            return;
        }
        const goto = event.target.closest("[data-goto]");
        if (goto) {
            if (goto.dataset.aiArea) setAiArea(goto.dataset.aiArea);
            if (goto.dataset.pdfOpenTool) state.activePdfTool = goto.dataset.pdfOpenTool;
            navigate(goto.dataset.goto);
            return;
        }
        const pdfQuick = event.target.closest("[data-pdf-quick]");
        if (pdfQuick) {
            state.activePdfTool = pdfQuick.dataset.pdfQuick;
            state.pdfCategory = "todos";
            return navigate("pdf");
        }
        const backdrop = event.target.closest("[data-doc-modal-backdrop]");
        if (backdrop && event.target === backdrop) {
            closeActiveDocument();
            return;
        }
        const docOpen = event.target.closest("[data-doc-open]");
        if (docOpen) {
            clearDocumentPdfPreview();
            state.activeDocId = docOpen.dataset.docOpen;
            if (state.view !== "documents") {
                state.view = "documents";
                document.body.dataset.view = "documents";
                updateAppChrome();
            }
            renderDocuments();
            return;
        }
        const closeDoc = event.target.closest("[data-close-doc]");
        if (closeDoc) {
            closeActiveDocument();
            return;
        }
        const pdfDownload = event.target.closest("[data-pdf-preview-download]");
        if (pdfDownload) {
            if (state.pdfPreviewBase64) {
                downloadBase64(state.pdfPreviewBase64, state.pdfPreviewFileName || "documento.pdf", "application/pdf");
            } else if (state.pdfPreviewUrl) {
                const a = document.createElement("a");
                a.href = state.pdfPreviewUrl;
                a.download = state.pdfPreviewFileName || "documento.pdf";
                a.rel = "noopener";
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                toast("Gere o PDF primeiro para baixar.", "error");
            }
            return;
        }
        const pdfOpen = event.target.closest("[data-pdf-preview-open]");
        if (pdfOpen) {
            if (state.pdfPreviewUrl) {
                window.open(state.pdfPreviewUrl, "_blank", "noopener,noreferrer");
            } else {
                toast("Gere o PDF primeiro para abrir a pré-visualização.", "error");
            }
            return;
        }
        const pdfClose = event.target.closest("[data-pdf-preview-close]");
        if (pdfClose) {
            clearDocumentPdfPreview();
            return;
        }
        const cat = event.target.closest("[data-category]");
        if (cat) {
            state.category = cat.dataset.category;
            // Atualiza chips + grade sem destruir o formulário aberto.
            $$("[data-category]", refs.content).forEach((btn) => {
                btn.classList.toggle("is-active", btn.dataset.category === state.category);
            });
            refreshDocumentLibraryGrid();
            return;
        }
        const pdfCategory = event.target.closest("[data-pdf-category]");
        if (pdfCategory) {
            state.pdfCategory = pdfCategory.dataset.pdfCategory || "todos";
            const firstVisible = Object.entries(PDF_TOOLS).find(([, tool]) => state.pdfCategory === "todos" || tool.category === state.pdfCategory);
            if (firstVisible && !(state.pdfCategory === "todos" || PDF_TOOLS[state.activePdfTool]?.category === state.pdfCategory)) state.activePdfTool = firstVisible[0];
            renderPdfTools();
            return;
        }
        const pdfTool = event.target.closest("[data-pdf-tool]");
        if (pdfTool) {
            clearPdfToolResult();
            state.pdfToolSelectedFiles = [];
            state.activePdfTool = pdfTool.dataset.pdfTool;
            renderPdfTools();
            return;
        }
        const pdfClearFiles = event.target.closest("[data-pdf-clear-files]");
        if (pdfClearFiles) {
            state.pdfToolSelectedFiles = [];
            const input = $("#pdfFiles");
            if (input) input.value = "";
            renderPdfFileList();
            setMessage($("#pdfMessage"), "", "");
            return;
        }
        const pdfRemoveFile = event.target.closest("[data-pdf-remove-file]");
        if (pdfRemoveFile) {
            const index = Number(pdfRemoveFile.dataset.pdfRemoveFile);
            if (Number.isInteger(index)) {
                state.pdfToolSelectedFiles = (state.pdfToolSelectedFiles || []).filter((_, i) => i !== index);
                assignPdfFiles(state.pdfToolSelectedFiles);
            }
            return;
        }
        const pdfToolDownload = event.target.closest("[data-pdf-tool-download]");
        if (pdfToolDownload) {
            if (state.pdfToolResultBase64) {
                downloadBase64(state.pdfToolResultBase64, state.pdfToolResultFileName || "resultado.pdf", "application/pdf");
            } else {
                toast("Processe um PDF primeiro.", "error");
            }
            return;
        }
        const pdfToolOpen = event.target.closest("[data-pdf-tool-open]");
        if (pdfToolOpen) {
            if (state.pdfToolResultUrl) window.open(state.pdfToolResultUrl, "_blank", "noopener,noreferrer");
            else toast("Processe um PDF primeiro.", "error");
            return;
        }
        const pdfToolCloseResult = event.target.closest("[data-pdf-tool-close-result]");
        if (pdfToolCloseResult) {
            clearPdfToolResult();
            return;
        }
        const hubLogout = event.target.closest("[data-hub-logout]");
        if (hubLogout) { logout(); return; }
        const aiTemplateCancel = event.target.closest("[data-ai-template-cancel]");
        if (aiTemplateCancel) {
            const wasMissing = state.aiTemplateDialog?.type === "missing-fields";
            state.aiTemplateDialog = null;
            if (!wasMissing) state.aiPendingTemplateRequest = null;
            renderAi();
            return;
        }
        const aiOpenTemplate = event.target.closest("[data-ai-open-template]");
        if (aiOpenTemplate) { openAiTemplateReview(aiOpenTemplate.dataset.aiOpenTemplate); return; }
        const aiTemplateWord = event.target.closest("[data-ai-template-word]");
        if (aiTemplateWord) {
            state.aiExportBusy = `template-word-${aiTemplateWord.dataset.aiTemplateWord}`; renderAi();
            downloadAiTemplate(aiTemplateWord.dataset.aiTemplateWord, "docx").catch((error) => toast(translateError(error), "error")).finally(() => { state.aiExportBusy = null; if (state.view === "ai") renderAi(); });
            return;
        }
        const aiTemplatePdf = event.target.closest("[data-ai-template-pdf]");
        if (aiTemplatePdf) {
            state.aiExportBusy = `template-pdf-${aiTemplatePdf.dataset.aiTemplatePdf}`; renderAi();
            downloadAiTemplate(aiTemplatePdf.dataset.aiTemplatePdf, "pdf").catch((error) => toast(translateError(error), "error")).finally(() => { state.aiExportBusy = null; if (state.view === "ai") renderAi(); });
            return;
        }
        const aiWord = event.target.closest("[data-ai-download-word]");
        if (aiWord) { downloadAiWord(aiWord.dataset.aiDownloadWord).catch((error) => toast(translateError(error), "error")); return; }
        const aiPdf = event.target.closest("[data-ai-download-pdf]");
        if (aiPdf) { downloadAiPdf(aiPdf.dataset.aiDownloadPdf).catch((error) => toast(translateError(error), "error")); return; }
        const aiCopy = event.target.closest("[data-ai-copy]");
        if (aiCopy) {
            const text = getAiMessageText(aiCopy.dataset.aiCopy);
            navigator.clipboard?.writeText(text).then(() => toast("Conteúdo copiado.", "success")).catch(() => toast("Não foi possível copiar.", "error"));
            return;
        }
        const aiMenuToggle = event.target.closest("[data-ai-menu-toggle]");
        if (aiMenuToggle) {
            state.aiAttachMenuOpen = !state.aiAttachMenuOpen;
            aiMenuToggle.setAttribute("aria-expanded", state.aiAttachMenuOpen ? "true" : "false");
            aiMenuToggle.closest(".ai-attach-menu-wrap")?.querySelector(".ai-attach-menu")?.classList.toggle("is-hidden", !state.aiAttachMenuOpen);
            $("#aiPrompt")?.focus();
            return;
        }
        const aiAnswerMissing = event.target.closest("[data-ai-answer-missing]");
        if (aiAnswerMissing) {
            const index = Number(aiAnswerMissing.dataset.aiAnswerMissing);
            const { message, doc } = getAiTemplateMessage(index);
            const missingFields = templateMissingFields(doc, message.templateData || {});
            state.aiTemplateDialog = { type: "missing-fields", docId: doc.id, messageIndex: index, missingFieldNames: missingFields.map((field) => canonicalFieldName(field.name)) };
            renderAi();
            return;
        }
        const aiAttach = event.target.closest("[data-ai-attach]");
        if (aiAttach) {
            state.aiAttachMenuOpen = false;
            aiAttach.closest(".ai-attach-menu")?.classList.add("is-hidden");
            aiAttach.closest(".ai-attach-menu-wrap")?.querySelector("[data-ai-menu-toggle]")?.setAttribute("aria-expanded", "false");
            $("#aiAttachmentInput")?.click();
            return;
        }
        const aiRemoveAttachment = event.target.closest("[data-ai-remove-attachment]");
        if (aiRemoveAttachment) {
            const index = Number(aiRemoveAttachment.dataset.aiRemoveAttachment);
            if (Number.isInteger(index)) state.aiAttachments = state.aiAttachments.filter((_, itemIndex) => itemIndex !== index);
            renderAi();
            return;
        }
        const aiExample = event.target.closest("[data-ai-example]");
        if (aiExample) {
            const prompt = $("#aiPrompt");
            if (prompt) {
                prompt.value = aiExample.dataset.aiExample || "";
                state.aiDrafts[state.aiArea] = prompt.value;
                persistAiDraft(state.aiArea, prompt.value);
                autoResizeAiPrompt(prompt);
                prompt.focus();
                prompt.setSelectionRange(prompt.value.length, prompt.value.length);
            }
            return;
        }
        const aiClear = event.target.closest("[data-ai-clear]");
        if (aiClear) {
            state.aiMessages = [];
            state.aiAttachments = [];
            state.aiDrafts[state.aiArea] = "";
            persistAiDraft(state.aiArea, "");
            state.aiAttachMenuOpen = false;
            state.aiTemplateDialog = null;
            state.aiPendingTemplateRequest = null;
            persistAiConversation();
            renderAi();
            return;
        }
        const aiTest = event.target.closest("[data-ai-test]");
        if (aiTest) {
            state.aiStatusChecked = false;
            state.aiStatusError = "";
            ensureAiStatus(true);
            renderAi();
            return;
        }

        const openAdminUserModal = event.target.closest("[data-open-admin-user-modal]");
        if (openAdminUserModal) { state.adminUserModalOpen = true; state.adminUserWizardStep = 0; state.adminEditingUserId = ""; renderAdmin(); return; }
        const closeAdminUserModal = event.target.closest("[data-close-admin-user-modal]");
        if (closeAdminUserModal || (event.target.matches?.("[data-close-admin-user-modal-backdrop]") && event.target === event.currentTarget)) { state.adminUserModalOpen = false; state.adminUserWizardStep = 0; state.adminEditingUserId = ""; renderAdmin(); return; }
        const wizardNext = event.target.closest("[data-admin-wizard-next]");
        if (wizardNext) { const form=$("#adminUserForm"); const panel=form?.querySelector(`[data-admin-wizard-panel="${state.adminUserWizardStep}"]`); const invalid=panel?.querySelector(':invalid'); if(invalid){ invalid.reportValidity(); return; } state.adminUserWizardStep=Math.min(4,state.adminUserWizardStep+1); syncAdminUserWizardUI(); return; }
        const wizardPrev = event.target.closest("[data-admin-wizard-prev]");
        if (wizardPrev) { state.adminUserWizardStep=Math.max(0,state.adminUserWizardStep-1); syncAdminUserWizardUI(); return; }

        const adminTab = event.target.closest("[data-admin-tab]");
        if (adminTab) {
            event.preventDefault();
            event.stopPropagation();
            state.adminTab = adminTab.dataset.adminTab || "users";
            state.adminUserModalOpen = false;
            state.adminUserWizardStep = 0;
            state.adminEditingUserId = "";
            state.adminHistory = [];
            state.adminHistoryUser = null;
            renderAdmin();
            return;
        }

        const loadSupport = event.target.closest("[data-load-support]");
        if (loadSupport) { loadSupportMessages().then(renderSupport).catch((e) => toast(translateError(e), "error")); return; }
        const createPixBtn = event.target.closest("[data-create-pix]");
        if (createPixBtn) { createPix(createPixBtn.dataset.createPix); return; }
        const loadAdmin = event.target.closest("[data-load-admin]");
        if (loadAdmin) { loadAdminUsers({ force: true }).catch((e) => toast(translateAdminUsersError(e), "error")); return; }
        const loadAdminSupport = event.target.closest("[data-load-admin-support]");
        if (loadAdminSupport) { loadAdminSupportMessages(); return; }
        const edit = event.target.closest("[data-edit-user]");
        if (edit) { editUser(edit.dataset.editUser); return; }
        const adminAction = event.target.closest("[data-admin-action]");
        if (adminAction) { runAdminAction(adminAction.dataset.adminAction, adminAction.dataset.action); return; }
        const clearAdmin = event.target.closest("[data-clear-admin-form]");
        if (clearAdmin) { $("#adminUserForm")?.reset(); if ($("#adminUid")) $("#adminUid").value = ""; return; }
        const markAdminDocs = event.target.closest("[data-admin-docs-all]");
        if (markAdminDocs) { $("#adminUserForm")?.querySelectorAll('input[name="allowedDocumentTypes"]').forEach((input) => { input.checked = true; }); return; }
        const clearAdminDocs = event.target.closest("[data-admin-docs-none]");
        if (clearAdminDocs) { $("#adminUserForm")?.querySelectorAll('input[name="allowedDocumentTypes"]').forEach((input) => { input.checked = false; }); return; }
        const closeHistory = event.target.closest("[data-close-user-history]");
        if (closeHistory) { state.adminHistory = []; state.adminHistoryUser = null; state.adminHistoryLoading = false; renderAdmin(); return; }
        const historyBtn = event.target.closest("[data-user-history]");
        if (historyBtn) { showUserHistory(historyBtn.dataset.userHistory); return; }
    }

    async function loadAdminSupportMessages() { return loadAdminSupport(); }

    async function showUserHistory(uid) {
        state.adminHistoryLoading = true;
        state.adminHistoryUser = state.adminUsers.find((user) => user.id === uid) || { id: uid };
        state.adminHistory = [];
        renderAdmin();
        try {
            const data = await apiRequest(`/api/admin/users/${encodeURIComponent(uid)}/history`);
            state.adminHistoryUser = data.user || state.adminHistoryUser;
            state.adminHistory = data.history || [];
        } catch (error) {
            toast(translateError(error), "error");
        } finally {
            state.adminHistoryLoading = false;
            if (state.view === "admin") renderAdmin();
        }
    }

    function handleContentSubmit(event) {
        if (event.target.id === "documentGenerateForm") { event.preventDefault(); generateDocument(event); }
        if (event.target.id === "pdfToolForm") { event.preventDefault(); processPdfTool(event); }
        if (event.target.id === "aiForm") { event.preventDefault(); submitAi(event); }
        if (event.target.id === "officeAiForm") { event.preventDefault(); submitOfficeAi(event); }
        if (event.target.id === "aiTemplateOptionsForm") { event.preventDefault(); confirmAiTemplateOptions(event); }
        if (event.target.id === "aiMissingFieldsForm") { event.preventDefault(); completeAiMissingFields(event); }
        if (event.target.id === "supportForm") { event.preventDefault(); submitSupport(event); }
        if (event.target.id === "adminUserForm") { event.preventDefault(); saveAdminUser(event); }
    }

    function handleContentInput(event) {
        if (event.target.id === "aiPrompt") {
            state.aiDrafts[state.aiArea] = event.target.value;
            persistAiDraft(state.aiArea, event.target.value);
            autoResizeAiPrompt(event.target);
        }
        if (event.target.id === "officeAiPrompt") state.officeAiPrompt = event.target.value;
        const smartField = event.target?.closest?.("[data-field-name]");
        if (smartField && "value" in smartField) applySmartFieldFormatting(smartField);

        if (event.target.id === "documentSearchZero") {
            const input = event.target;
            const caret = input.selectionStart;
            state.query = input.value;
            refreshDocumentLibraryGrid();
            const nextInput = $("#documentSearchZero");
            if (nextInput) {
                nextInput.focus();
                try {
                    const pos = typeof caret === "number" ? caret : nextInput.value.length;
                    nextInput.setSelectionRange(pos, pos);
                } catch (_) {}
            }
        }
    }

    function autoResizeAiPrompt(textarea = $("#aiPrompt")) {
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(180, Math.max(28, textarea.scrollHeight))}px`;
    }

    function handleContentKeydown(event) {
        if (event.target?.id !== "aiPrompt") return;
        if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
            event.preventDefault();
            event.target.closest("#aiForm")?.requestSubmit();
        }
    }

    async function handleContentBlur(event) {
        const field = event.target?.closest?.("[data-field-name]");
        if (!field || !("value" in field)) return;
        validateSmartField(field);
        if (smartFieldType(field.dataset.fieldName, field.closest("label")?.querySelector("span")?.textContent) === "cep") {
            await autofillAddressFromCep(field).catch(() => {});
        }
    }

    function smartFieldType(name, label = "") {
        const text = normalize(`${name || ""} ${label || ""}`);
        if (text.includes("cpf") || text.includes("cnpj")) return "cpfcnpj";
        if (["telefone", "celular", "whatsapp", "fone"].some((token) => text.includes(token))) return "phone";
        if (text.includes("cep")) return "cep";
        if (text.includes("data") && !text.includes("atualizacao")) return "date";
        if (["valor", "renda", "preco", "preço"].some((token) => text.includes(token))) return "money";
        return "";
    }

    function digitsOnly(value) { return String(value || "").replace(/\D/g, ""); }

    function applySmartFieldFormatting(field) {
        const type = smartFieldType(field.dataset.fieldName, field.closest("label")?.querySelector("span")?.textContent);
        const digits = digitsOnly(field.value);
        if (type === "cpfcnpj") {
            const limited = digits.slice(0, 14);
            field.value = limited.length <= 11
                ? limited.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                : limited.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
        } else if (type === "phone") {
            const limited = digits.slice(0, 11);
            field.value = limited.length <= 10
                ? limited.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
                : limited.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
        } else if (type === "cep") {
            field.value = digits.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
        } else if (type === "date") {
            field.value = digits.slice(0, 8).replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
        }
    }

    function validateSmartField(field) {
        const type = smartFieldType(field.dataset.fieldName, field.closest("label")?.querySelector("span")?.textContent);
        const digits = digitsOnly(field.value);
        let valid = true;
        if (type === "cpfcnpj" && digits.length) valid = digits.length === 11 ? isValidCpf(digits) : digits.length === 14 ? isValidCnpj(digits) : false;
        if (type === "phone" && digits.length) valid = digits.length === 10 || digits.length === 11;
        if (type === "cep" && digits.length) valid = digits.length === 8;
        field.classList.toggle("is-invalid", !valid);
        field.setAttribute("aria-invalid", valid ? "false" : "true");
        field.title = valid ? "" : type === "cpfcnpj" ? "CPF/CNPJ inválido." : "Confira o valor informado.";
        return valid;
    }

    function isValidCpf(cpf) {
        if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;
        const calc = (len) => { let sum = 0; for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i); const r = (sum * 10) % 11; return r === 10 ? 0 : r; };
        return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10]);
    }

    function isValidCnpj(cnpj) {
        if (!/^\d{14}$/.test(cnpj) || /^(\d)\1+$/.test(cnpj)) return false;
        const digit = (base, weights) => { const sum = base.split("").reduce((acc, n, i) => acc + Number(n) * weights[i], 0); const mod = sum % 11; return mod < 2 ? 0 : 11 - mod; };
        const d1 = digit(cnpj.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
        const d2 = digit(cnpj.slice(0, 12) + d1, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
        return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
    }

    async function autofillAddressFromCep(cepField) {
        const cep = digitsOnly(cepField.value);
        if (cep.length !== 8) return;
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) return;
        const data = await response.json();
        if (data.erro) return;
        const form = cepField.closest("form");
        if (!form) return;
        fillFirstEmptyField(form, ["logradouro", "endereco", "endereço", "rua"], data.logradouro);
        fillFirstEmptyField(form, ["bairro"], data.bairro);
        fillFirstEmptyField(form, ["municipio", "município", "cidade"], data.localidade);
        fillFirstEmptyField(form, ["uf", "estado_uf", "sigla_estado"], data.uf);
        toast("Endereço reconhecido pelo CEP.", "success");
    }

    function fillFirstEmptyField(form, tokens, value) {
        if (!value) return;
        const field = Array.from(form.querySelectorAll("[data-field-name]")).find((item) => {
            const key = normalize(item.dataset.fieldName || "");
            return tokens.some((token) => key === normalize(token) || key.includes(normalize(token)));
        });
        if (field && !String(field.value || "").trim()) {
            field.value = value;
            field.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function refreshDocumentLibraryGrid() {
        const filtered = getFilteredDocs();
        const cardsHtml = filtered.map(docCard).join("");
        const grids = $$(":scope > .grid", refs.content);
        if (grids[0]) {
            grids[0].innerHTML = cardsHtml;
            return;
        }
        renderDocuments();
    }

    function handleContentChange(event) {
        if (event.target?.id === "officeAiMode") {
            state.officeAiMode = event.target.value || "replace";
            return;
        }
        if (event.target?.id === "profileAvatarInput") {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            prepareProfileAvatar(file).then(updateProfileAvatar).catch((error) => toast(translateError(error), "error"));
            return;
        }
        if (event.target?.id === "aiAttachmentInput") {
            const input = event.target;
            addAiAttachments(input.files).catch((error) => toast(translateError(error), "error"));
            input.value = "";
            return;
        }
        const form = event.target?.closest?.("#documentGenerateForm");
        if (form) {
            updateConditionalDocumentFields(form);
            // Atualiza rail (esconde etapas de cônjuge/óbito quando não se aplicam).
            updateDocumentWizard(form);
        }
    }

    function handleContentPaste(event) {
        if (!event.target?.closest?.("#aiForm")) return;
        const files = Array.from(event.clipboardData?.files || []).filter((file) => file.type?.startsWith("image/") || file.type === "application/pdf");
        if (!files.length) return;
        event.preventDefault();
        addAiAttachments(files).catch((error) => toast(translateError(error), "error"));
    }

    function handleContentDragOver(event) {
        const form = event.target?.closest?.("#aiForm");
        if (!form || !Array.from(event.dataTransfer?.types || []).includes("Files")) return;
        event.preventDefault();
        form.classList.add("is-dragover");
    }

    function handleContentDragLeave(event) {
        const form = event.target?.closest?.("#aiForm");
        if (!form || form.contains(event.relatedTarget)) return;
        form.classList.remove("is-dragover");
    }

    function handleContentDrop(event) {
        const form = event.target?.closest?.("#aiForm");
        if (!form) return;
        event.preventDefault();
        form.classList.remove("is-dragover");
        addAiAttachments(event.dataTransfer?.files).catch((error) => toast(translateError(error), "error"));
    }


    function moveDocumentStep(form, delta) {
        if (!form) return;
        const panels = $$("[data-step-panel]", form);
        if (!panels.length) return;
        updateConditionalDocumentFields(form);

        const current = Number(form.dataset.currentStep || 0);
        let next = current + delta;
        while (next >= 0 && next < panels.length) {
            // Pula etapas só com campos condicionais ocultos (ex.: cônjuge/óbito = Não).
            if (!isWizardStepEmpty(panels[next])) break;
            next += delta;
        }
        next = Math.max(0, Math.min(panels.length - 1, next));
        if (next === current) return;
        form.dataset.currentStep = String(next);
        updateDocumentWizard(form);
        form.closest(".document-modal-body")?.scrollTo({ top: 0, behavior: "smooth" });
    }

    function isWizardStepEmpty(panel) {
        if (!panel) return true;
        // Etapa de revisão (sem campos) nunca é considerada vazia.
        if (panel.querySelector("[data-generate-type]")) return false;
        const fields = $$("[data-field-name]", panel);
        if (!fields.length) return false;
        return fields.every((field) => {
            const wrapper = field.closest(".field");
            return Boolean(
                field.disabled ||
                wrapper?.hidden ||
                wrapper?.classList.contains("is-conditional-hidden")
            );
        });
    }

    function updateDocumentWizard(form) {
        updateConditionalDocumentFields(form);
        const panels = $$("[data-step-panel]", form);
        let current = Number(form.dataset.currentStep || 0);

        // Se a etapa atual ficou vazia após mudar cônjuge/óbito, avança para a próxima útil.
        if (panels[current] && isWizardStepEmpty(panels[current])) {
            let next = current;
            while (next < panels.length && isWizardStepEmpty(panels[next])) next += 1;
            if (next >= panels.length) {
                next = current;
                while (next > 0 && isWizardStepEmpty(panels[next])) next -= 1;
            }
            current = Math.max(0, Math.min(panels.length - 1, next));
            form.dataset.currentStep = String(current);
        }

        panels.forEach((panel, index) => panel.classList.toggle("is-active", index === current));
        $$("[data-step-indicator]", form).forEach((item, index) => {
            const empty = isWizardStepEmpty(panels[index]);
            item.classList.toggle("is-active", index === current);
            item.classList.toggle("is-done", index < current && !empty);
            item.classList.toggle("is-skipped", empty && index !== current);
            item.hidden = empty && index !== current;
        });
    }

    function countDocumentFields(doc) {
        return Number(doc.fields?.length || 0) + Number(doc.choices?.length || 0);
    }

    // Ordem fixa das partes no assistente (o usuário preenche uma e clica em Próximo).
    const DOCUMENT_STEP_ORDER = [
        "configuracao",
        "parte_comodante",
        "parte_falecido",
        "parte_comodatario",
        "parte_arrendador",
        "parte_arrendatario",
        "parte_outorgante",
        "parte_outorgado",
        "parte_vendedor",
        "parte_comprador",
        "parte_posseiro",
        "parte_produtor",
        "parte_segurado",
        "parte_declarante",
        "parte_pessoa",
        "parte_convivente_1",
        "parte_convivente_2",
        "parte_dependente",
        "parte_representante",
        "parte_conjuge",
        "parte_obito_representacao",
        "parte_familia",
        "parte_periodos_trabalho",
        "parte_terras_autodeclaracao",
        "parte_atividades_listadas",
        "parte_imovel",
        "parte_confrontantes",
        "parte_bens",
        "parte_producao",
        "parte_condicoes",
        "parte_extras_autodeclaracao",
        "parte_testemunhas",
        "parte_dados_principais",
        "parte_fechamento",
        "revisao",
    ];

    function buildDocumentSteps(doc) {
        const buckets = new Map();
        const addStep = (key, title, description) => {
            if (!buckets.has(key)) {
                buckets.set(key, { key, title, description, items: [] });
            }
            return buckets.get(key);
        };

        if (doc.choices?.length) {
            const step = addStep(
                "configuracao",
                "Configuração",
                "Escolha as opções do modelo (cônjuge, óbito, representação etc.) antes de digitar os dados."
            );
            doc.choices.forEach((choice) => step.items.push({ kind: "choice", choice }));
        }

        (doc.fields || []).forEach((field) => {
            const section = classifyDocumentField(field, doc);
            const step = addStep(section.key, section.title, section.description);
            step.items.push({ kind: "field", field });
        });

        addStep(
            "revisao",
            "Revisão e geração",
            "Confira as partes preenchidas. Se estiver tudo certo, gere o Word ou o PDF protegido."
        );

        const known = DOCUMENT_STEP_ORDER
            .map((key) => buckets.get(key))
            .filter((step) => step && (step.key === "revisao" || step.items.length > 0));

        // Qualquer etapa nova não listada entra antes da revisão.
        const extras = [...buckets.values()].filter(
            (step) => step.key !== "revisao" && !DOCUMENT_STEP_ORDER.includes(step.key) && step.items.length
        );
        const review = buckets.get("revisao");
        return [...known.filter((s) => s.key !== "revisao"), ...extras, review].filter(Boolean);
    }

    /**
     * Separa os campos em PARTES do documento (uma etapa por parte).
     * Ex.: Comodante → Comodatário → Imóvel → Cônjuge → Fechamento → Revisão.
     * Cada papel (vendedor, comprador, arrendador...) vira etapa própria.
     */
    function classifyDocumentField(field, doc = null) {
        const rawName = String(field?.name || "");
        const rawLabel = String(field?.label || "");
        const key = normalizeFieldKey(rawName);
        const text = normalize(`${rawName} ${rawLabel}`);
        const docId = String(doc?.id || "");

        // ── Papéis de pessoa (ordem importa: mais específico primeiro) ──
        const partyRules = [
            { match: (k, t) => includesParty(k, t, ["comandante_falecido", "comodante_falecido"]) || (includesParty(k, t, ["falecido"]) && includesParty(k, t, ["comandante", "comodante"])),
              key: "parte_falecido", title: "Comodante falecido", description: "Dados do comodante falecido, quando o modelo for com óbito." },
            { match: (k, t) => includesParty(k, t, ["comandante", "comodante"]) && !includesParty(k, t, ["comandatario", "comodatario", "falecido"]),
              key: "parte_comodante", title: "Comodante", description: "Digite os dados do comodante (quem cede o bem ou a terra). Depois clique em Próximo." },
            { match: (k, t) => includesParty(k, t, ["comandatario", "comodatario", "comandatrio"]),
              key: "parte_comodatario", title: "Comodatário", description: "Digite os dados do comodatário (quem recebe o bem ou usa a terra). Depois clique em Próximo." },
            { match: (k, t) => includesParty(k, t, ["arrendador"]),
              key: "parte_arrendador", title: "Arrendador", description: "Dados de quem arrenda (cede) o imóvel." },
            { match: (k, t) => includesParty(k, t, ["arrendatario"]),
              key: "parte_arrendatario", title: "Arrendatário", description: "Dados de quem toma o imóvel em arrendamento." },
            { match: (k, t) => includesParty(k, t, ["outorgante"]),
              key: "parte_outorgante", title: "Outorgante", description: "Dados do outorgante da parceria ou procuração." },
            { match: (k, t) => includesParty(k, t, ["outorgado"]),
              key: "parte_outorgado", title: "Outorgado", description: "Dados do outorgado da parceria ou procuração." },
            { match: (k, t) => includesParty(k, t, ["vendedor"]),
              key: "parte_vendedor", title: "Vendedor", description: "Dados completos do vendedor. Depois clique em Próximo." },
            { match: (k, t) => includesParty(k, t, ["comprador"]),
              key: "parte_comprador", title: "Comprador", description: "Dados completos do comprador. Depois clique em Próximo." },
            { match: (k, t) => includesParty(k, t, ["convivente_1", "convivente1"]) || (k.includes("convivente") && (k.includes("_1") || t.includes("convivente 1"))),
              key: "parte_convivente_1", title: "Convivente 1", description: "Dados do primeiro convivente da união estável." },
            { match: (k, t) => includesParty(k, t, ["convivente_2", "convivente2"]) || (k.includes("convivente") && (k.includes("_2") || t.includes("convivente 2"))),
              key: "parte_convivente_2", title: "Convivente 2", description: "Dados do segundo convivente da união estável." },
            { match: (k, t) => includesParty(k, t, ["dependente"]) && !includesParty(k, t, ["renda_dependente"]),
              key: "parte_dependente", title: "Dependente", description: "Dados da pessoa dependente economicamente." },
            { match: (k, t) => includesParty(k, t, ["posseiro"]),
              key: "parte_posseiro", title: "Posseiro", description: "Dados de quem exerce a posse." },
            { match: (k, t) => includesParty(k, t, ["produtor"]),
              key: "parte_produtor", title: "Produtor", description: "Dados do produtor rural responsável." },
            { match: (k, t) => includesParty(k, t, ["segurado"]),
              key: "parte_segurado", title: "Segurado", description: "Dados pessoais do segurado da autodeclaração." },
            { match: (k, t) => includesParty(k, t, ["declarante"]),
              key: "parte_declarante", title: "Declarante", description: "Dados de quem faz a declaração." },
            // nome_representante (UFBA etc.) = pessoa principal; rg_representante do comodato vai para óbito.
            { match: (k, t) => (k === "nome_representante" || k.startsWith("nome_representante_")) && !hasAny(t, ["falecido"]),
              key: "parte_representante", title: "Representante", description: "Dados do representante responsável pelo documento." },
            { match: (k, t) => includesParty(k, t, ["pessoa", "cliente", "requerente"]) && !includesParty(k, t, ["familiar"]),
              key: "parte_pessoa", title: "Pessoa / cliente", description: "Dados principais da pessoa do documento." },
        ];

        for (const rule of partyRules) {
            if (rule.match(key, text)) {
                return { key: rule.key, title: rule.title, description: rule.description };
            }
        }

        // Cônjuge (não misturar com comodante/comodatário)
        if (hasAny(text, ["conjuge", "companheiro"]) || key.includes("conjuge")) {
            return {
                key: "parte_conjuge",
                title: "Cônjuge / companheiro(a)",
                description: "Preencha os dados do cônjuge ou companheiro(a). Esta etapa só aparece quando a configuração pedir.",
            };
        }

        // Óbito / representante do falecido (comodato e similares)
        if (
            hasAny(text, ["obito", "falecimento", "falecido", "parentesco_representante", "representante_do_falecido"])
            || key.includes("obito")
            || key.includes("falecido")
            || key.includes("falecimento")
            || (key.includes("representante") && key !== "nome_representante")
        ) {
            return {
                key: "parte_obito_representacao",
                title: "Óbito e representação",
                description: "Informe dados do óbito e do representante do falecido, se o modelo exigir.",
            };
        }

        // Confrontantes (Norte/Sul/Leste/Oeste) — etapa própria
        if (hasAny(text, ["confrontante", "confrontado", "confrontacao", "ao_norte", "ao_sul", "ao_leste", "ao_oeste", "cpf_norte", "cpf_sul", "cpf_leste", "cpf_oeste"])
            || /_(norte|sul|leste|oeste)$/.test(key) || key.includes("confrontante")) {
            return {
                key: "parte_confrontantes",
                title: "Confrontantes",
                description: "Informe os confrontantes (norte, sul, leste e oeste) e documentos.",
            };
        }

        // Família / membros
        if (hasAny(text, ["familiar", "membro", "mebro", "componente", "titular"]) || key.includes("familiar") || key.includes("membro")) {
            return {
                key: "parte_familia",
                title: "Família / membros",
                description: "Dados dos membros da família ou do grupo familiar.",
            };
        }

        // Empregados / IPI / outras rendas (autodeclaração)
        if (hasAny(text, ["empregado", "ipi_", "outra_atividade", "outra_renda", "cooperativa", "sim_ipi", "nao_ipi", "sim_empregados", "nao_empregados", "sim_outra", "nao_outra", "sim_cooperativa", "nao_cooperativa"])) {
            return {
                key: "parte_extras_autodeclaracao",
                title: "Rendas e vínculos extras",
                description: "IPI, empregados, outras atividades, outras rendas e cooperativa.",
            };
        }

        // Períodos de trabalho rural (autodeclaração)
        if (hasAny(text, ["periodo_inicial", "periodo_final", "condicao_", "situacao_individual", "situacao_regime"])) {
            return {
                key: "parte_periodos_trabalho",
                title: "Períodos de trabalho",
                description: "Informe os períodos, condições e situações de trabalho rural.",
            };
        }

        // Propriedades / terras da autodeclaração
        if (hasAny(text, ["itr_terra", "nome_propiedade", "area_total_", "area_explorada", "nome_proprietario", "cpf_proprietario", "municipio_uf_"])) {
            return {
                key: "parte_terras_autodeclaracao",
                title: "Terras e propriedades",
                description: "Cadastro das terras e proprietários da autodeclaração rural.",
            };
        }

        // Atividades rurais listadas
        if (hasAny(text, ["atividade_rural_", "subsistencia_venda"])) {
            return {
                key: "parte_atividades_listadas",
                title: "Atividades rurais",
                description: "Liste as atividades rurais e se são para subsistência ou venda.",
            };
        }

        // Imóvel / propriedade / área
        if (hasAny(text, [
            "imovel", "propriedade", "posse", "terra", "area", "nirf", "incra", "matricula",
            "gleba", "perimetro", "car_imovel", "ccir", "denominacao", "localizacao",
            "nome_imovel", "endereco_imovel", "municipio_imovel", "registro_imovel",
            "registro_rural", "registro_propriedade", "area_imovel", "area_total",
            "tamanho_trerra", "tamanho_terra", "tamanho_utilizado", "oque_produz",
        ]) || key.includes("imovel") || key.includes("propriedade") || key.includes("nirf")) {
            return {
                key: "parte_imovel",
                title: "Imóvel / propriedade",
                description: "Identificação, localização, área e registros do imóvel ou da posse.",
            };
        }

        // Equipamentos / veículos / bens
        if (hasAny(text, [
            "equipamento", "marca_modelo", "serie_chassi", "estado_conservacao", "acessorios_",
            "veiculo", "placa", "renavam", "chassi", "quilometragem", "tipo_bem", "marca_bem",
            "modelo_bem", "ano_modelo", "cor_bem", "descricao_complementar",
        ]) || key.includes("equipamento") || key.includes("veiculo") || key.includes("_bem")) {
            return {
                key: "parte_bens",
                title: "Bens / equipamentos / veículo",
                description: "Descreva os bens, equipamentos ou o veículo do contrato.",
            };
        }

        // Produção / rebanho / inventário
        if (hasAny(text, [
            "atividade_", "quantidade_", "unidade_", "estoque_", "especie_", "categoria_",
            "entradas_", "saidas_", "produto_", "receita_", "despesas_", "saldo_",
            "vacinacao", "controle_sanitario", "forma_identificacao", "total_nascimentos",
            "total_compras", "total_vendas", "total_mortes", "local_armazenamento",
            "destino_producao", "ano_referencia", "ano_safra", "ano_controle",
            "produto1", "produto2", "produto3", "valor1", "valor2", "valor3",
            "valor_total", "tipo_renda", "valor_anual",
        ])) {
            return {
                key: "parte_producao",
                title: "Produção / valores / rebanho",
                description: "Informe produção, rebanho, produtos, quantidades e valores.",
            };
        }

        // Condições contratuais (prazos, pagamento, foro)
        if (hasAny(text, [
            "prazo", "duracao", "duração", "data_inicio", "data_fim", "valor_arrendamento",
            "valor_venda", "forma_pagamento", "periodicidade", "indice_reajuste",
            "inadimplencia", "rescisao", "foro", "numero_vias", "percentual_",
            "finalidade", "divisao_despesas", "responsavel_despesas", "regra_manutencao",
            "regime_bens", "renda_", "ajuda", "manutencao", "orgao_destino",
            "lista_documentos", "beneficio", "nome_beneficio",
        ])) {
            return {
                key: "parte_condicoes",
                title: "Condições e valores",
                description: "Prazos, valores, forma de pagamento, finalidade e condições do documento.",
            };
        }

        // Testemunhas
        if (hasAny(text, ["testemunha"])) {
            return {
                key: "parte_testemunhas",
                title: "Testemunhas",
                description: "CPF ou dados das testemunhas, se o modelo pedir.",
            };
        }

        // Fechamento: data, cidade, assinatura
        if (
            hasAny(text, ["data_assinatura", "cidade_assinatura", "uf_assinatura", "data_assinatura_extenso"])
            || ["dia", "mes", "mês", "ano", "cidade", "uf", "data", "municipio"].includes(key)
            || key.endsWith("_dia") || key.endsWith("_mes") || key.endsWith("_ano")
        ) {
            return {
                key: "parte_fechamento",
                title: "Local, data e assinatura",
                description: "Cidade, data e demais dados de fechamento do documento.",
            };
        }

        // Fallback por tipo de documento
        if (docId.includes("declaracao") || docId.includes("procuracao") || docId.includes("honorarios") || docId.includes("prev-")) {
            return {
                key: "parte_dados_principais",
                title: "Dados principais",
                description: "Preencha os dados principais desta etapa e avance com Próximo.",
            };
        }

        return {
            key: "parte_dados_principais",
            title: "Dados principais",
            description: "Preencha os campos desta parte e clique em Próximo.",
        };
    }

    function includesParty(normalizedKey, normalizedText, tokens) {
        return tokens.some((token) => {
            const t = normalize(token);
            return normalizedKey.includes(t) || normalizedText.includes(t);
        });
    }

    function hasAny(text, terms) {
        return terms.some((term) => text.includes(normalize(term)) || text.includes(term));
    }

    async function apiRequest(path, options = {}) {
        const headers = new Headers(options.headers || {});
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        const billingToken = localStorage.getItem(BILLING_TOKEN_KEY);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        if (billingToken) headers.set("X-Billing-Token", billingToken);
        const request = { method: options.method || "GET", headers, credentials: "include", cache: options.cache || ((options.method || "GET") === "GET" ? "no-store" : "default") };
        headers.set("Accept", "application/json");
        if (options.body !== undefined) {
            headers.set("Content-Type", "application/json");
            request.body = JSON.stringify(options.body);
        }
        const response = await fetch(`${API_BASE_URL}${path}`, request);
        const text = await response.text();
        let data = {};
        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { message: text }; }
        if (response.ok && text && !contentType.includes("application/json") && /^\s*</.test(text)) {
            const error = new Error("A API respondeu uma página HTML em vez de JSON. O Worker publicado está desatualizado ou a URL da API está incorreta.");
            error.status = 502;
            error.data = { message: error.message };
            throw error;
        }
        if (data.sessionToken) localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
        if (data.billingToken) localStorage.setItem(BILLING_TOKEN_KEY, data.billingToken);
        if (!response.ok) {
            const error = new Error(data.message || `Erro HTTP ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }
        return data;
    }

    function getFilteredDocs() {
        const query = normalize(state.query);
        return DOCS.filter((doc) => {
            if (state.disabledTemplateIds?.has?.(doc.id)) return false;
            if (doc.isActive === false) return false;
            const matchesCategory = state.category === "todos" || doc.category === state.category;
            const haystack = normalize(`${doc.title} ${doc.description} ${doc.id} ${(doc.keywords || []).join(" ")}`);
            return matchesCategory && (!query || haystack.includes(query));
        });
    }

    function mergeTemplates(customTemplates = [], settings = {}) {
        state.templateSettings = settings || {};
        state.disabledTemplateIds = new Set(
            Object.entries(settings || {})
                .filter(([, value]) => value && value.isActive === false)
                .map(([id]) => id)
        );

        // Remove custom docs previously injected, then re-add active ones.
        for (let i = DOCS.length - 1; i >= 0; i -= 1) {
            if (DOCS[i]?.custom) {
                DOC_MAP.delete(DOCS[i].id);
                DOCS.splice(i, 1);
            }
        }

        (customTemplates || []).forEach((template) => {
            if (!template?.slug && !template?.id) return;
            if (template.isActive === false) return;
            const id = template.slug || template.id;
            if (state.disabledTemplateIds.has(id)) return;
            const doc = {
                id,
                title: template.title || id,
                description: template.description || "Modelo customizado",
                category: template.category || "outros",
                fields: Array.isArray(template.fields) ? template.fields.map(normalizeTemplateFieldForUi) : [],
                modelPath: template.modelPath || "",
                modelBase64: template.modelBase64 || "",
                fileName: `${id}.docx`,
                custom: true,
                isActive: template.isActive !== false,
            };
            DOCS.push(doc);
            DOC_MAP.set(id, doc);
        });

        if (!CATEGORIES.some((c) => c.id === "outros")) {
            CATEGORIES.push({ id: "outros", label: "Outros" });
        }
    }

    function openDocumentWithData(documentType, formData = {}, options = {}) {
        const doc = DOC_MAP.get(documentType);
        if (!doc) {
            toast(`Modelo "${documentType}" não encontrado ou desativado.`, "error");
            return;
        }
        state.pendingFormData = formData || {};
        state.pendingFormStep = Number.isInteger(options.step) ? options.step : 0;
        state.activeDocId = documentType;
        navigate("documents");
    }

    function getDoc(documentType) {
        return DOC_MAP.get(documentType);
    }

    function listDocs() {
        return DOCS.slice();
    }

    function downloadBase64(base64, fileName, mime) {
        const blob = base64ToBlob(base64, mime || "application/octet-stream");
        saveBlob(blob, fileName);
    }

    function exposeDocSpaceCore() {
        window.DocSpaceCore = {
            apiRequest,
            toast,
            escapeHtml,
            getState: () => state,
            getDoc,
            listDocs,
            collectFormData,
            openDocumentWithData,
            mergeTemplates,
            navigate,
            showDocumentPdfPreview,
            downloadBase64,
            DOC_MAP,
            DOCS,
        };
    }
    exposeDocSpaceCore();

    function getDocQuota(id) {
        if (!state.documentUsage || state.documentUsage.unlimited) return { remaining: "∞", blocked: false };
        const q = state.documentUsage.documents?.[id];
        // Se o tipo ainda não veio no mapa, considera bloqueado (evita liberar com fallback errado).
        if (!q) return { remaining: 0, blocked: true };
        const remaining = Number(q.remaining ?? 0);
        return { remaining, blocked: remaining <= 0 || Boolean(q.blocked) };
    }
    function getTotalRemainingDocuments() {
        if (!state.documentUsage || state.documentUsage.unlimited) return "∞";
        if (Number.isFinite(Number(state.documentUsage.totalRemaining))) return Math.max(0, Number(state.documentUsage.totalRemaining));
        const first = Object.values(state.documentUsage.documents || {})[0];
        return Math.max(0, Number(first?.remaining || 0));
    }
    function getTotalRemainingPdf() {
        if (!state.pdfToolUsage || state.pdfToolUsage.unlimited) return state.pdfToolUsage?.allowed === false ? 0 : "∞";
        return Object.values(state.pdfToolUsage.tools || {}).reduce((sum, item) => sum + Number(item.remaining || 0), 0);
    }
    function ensureDocumentAvailable(id) {
        const quota = getDocQuota(id);
        if (quota.blocked) throw new Error("A cota total de gerações foi atingida.");
    }

    async function ensureDocxLibs() {
        if (!window.PizZip || !window.docxtemplater) throw new Error("Bibliotecas DOCX não carregadas. Verifique sua conexão com os CDNs.");
    }

    function parsePages(text, total) {
        const result = [];
        String(text || "").split(",").map((p) => p.trim()).filter(Boolean).forEach((part) => {
            const [a, b] = part.split("-").map((v) => Number(v.trim()));
            if (Number.isInteger(a) && Number.isInteger(b)) {
                for (let i = Math.min(a,b); i <= Math.max(a,b); i++) if (i >= 1 && i <= total) result.push(i - 1);
            } else if (Number.isInteger(a) && a >= 1 && a <= total) result.push(a - 1);
        });
        return [...new Set(result)];
    }
    async function savePdf(pdfDoc, name) {
        const bytes = await pdfDoc.save();
        saveBlob(new Blob([bytes], { type: "application/pdf" }), name);
    }
    function wrapText(text, limit) {
        const lines = [];
        String(text).split(/\n+/).forEach((paragraph) => {
            const words = paragraph.split(/\s+/).filter(Boolean);
            let current = "";
            words.forEach((word) => {
                if ((current + " " + word).trim().length > limit) { lines.push(current); current = word; }
                else current = (current + " " + word).trim();
            });
            if (current) lines.push(current);
            lines.push("");
        });
        return lines;
    }

    function renderMessageList(messages, admin = false) {
        if (!messages?.length) return `<p class="message">Nenhuma mensagem carregada.</p>`;
        return `<div class="grid">${messages.slice(0, 20).map((m) => `<article class="document-card"><h3>${escapeHtml(m.customerName || m.customer_name || m.senderType || "Mensagem")}</h3><p>${escapeHtml(m.message || "Sem texto")}</p><div class="card-meta"><span class="badge">${escapeHtml(m.customerEmail || m.customer_email || "")}</span><span class="badge">${formatDate(m.createdAt || m.created_at)}</span>${admin ? `<span class="badge">${escapeHtml(m.category || "support")}</span>` : ""}</div></article>`).join("")}</div>`;
    }

    function setFormLoading(form, loading) {
        if (!form) return;
        $$("button, input, textarea, select", form).forEach((el) => {
            if (el.type === "hidden") return;
            el.disabled = loading;
        });
        // Ao reabilitar, reaplica regras condicionais (cônjuge/óbito etc.).
        if (!loading) updateConditionalDocumentFields(form);
    }
    function setMessage(el, text, type) { if (el) { el.textContent = text || ""; el.className = `message ${type || ""}`.trim(); } }

    let PDF_ZIP_CRC_TABLE = null;

    function getPdfZipCrcTable() {
        if (PDF_ZIP_CRC_TABLE) return PDF_ZIP_CRC_TABLE;
        const table = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let value = n;
            for (let bit = 0; bit < 8; bit++) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
            table[n] = value >>> 0;
        }
        PDF_ZIP_CRC_TABLE = table;
        return table;
    }

    async function calculateBlobCrc32(blob) {
        const table = getPdfZipCrcTable();
        let crc = 0xffffffff;
        const update = (bytes) => {
            for (let index = 0; index < bytes.length; index++) crc = table[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
        };
        if (blob?.stream && typeof blob.stream === "function") {
            const reader = blob.stream().getReader();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    update(value);
                }
            } finally {
                try { reader.releaseLock(); } catch (_) {}
            }
        } else {
            update(new Uint8Array(await blob.arrayBuffer()));
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    function getZipDosDateTime(value = new Date()) {
        const date = value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date();
        const year = Math.max(1980, date.getFullYear());
        return {
            time: ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | ((Math.floor(date.getSeconds() / 2)) & 31),
            date: (((year - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31),
        };
    }

    function writeZipUint16(view, offset, value) { view.setUint16(offset, value & 0xffff, true); }
    function writeZipUint32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }

    function sanitizeZipEntryName(value, fallback) {
        const clean = String(value || fallback || "arquivo")
            .replace(/[\\/:*?"<>|]+/g, "-")
            .replace(/^\.+/, "")
            .trim();
        return clean || fallback || "arquivo";
    }

    async function createPdfOutputZip(files, onProgress) {
        const valid = (Array.isArray(files) ? files : []).filter((item) => item?.blob instanceof Blob);
        if (!valid.length) throw new Error("Nenhum arquivo válido foi gerado para o ZIP.");
        if (valid.length > 65535) throw new Error("Quantidade de arquivos acima do limite suportado pelo ZIP.");

        const encoder = new TextEncoder();
        const usedNames = new Set();
        const entries = [];
        let localOffset = 0;

        for (const [index, item] of valid.entries()) {
            let name = sanitizeZipEntryName(item.fileName, `parte-${String(index + 1).padStart(3, "0")}.pdf`);
            if (usedNames.has(name.toLowerCase())) {
                const dot = name.lastIndexOf(".");
                const base = dot > 0 ? name.slice(0, dot) : name;
                const ext = dot > 0 ? name.slice(dot) : "";
                name = `${base}-${index + 1}${ext}`;
            }
            usedNames.add(name.toLowerCase());
            const nameBytes = encoder.encode(name);
            const size = Number(item.blob.size || 0);
            if (size > 0xffffffff) throw new Error(`O arquivo ${name} ultrapassa 4 GB e não cabe no ZIP padrão.`);
            const crc32 = await calculateBlobCrc32(item.blob);
            const dos = getZipDosDateTime(item.lastModified ? new Date(item.lastModified) : new Date());
            entries.push({ blob: item.blob, name, nameBytes, size, crc32, offset: localOffset, dos });
            localOffset += 30 + nameBytes.length + size;
            if (localOffset > 0xffffffff) throw new Error("O pacote final ultrapassa 4 GB. Divida o trabalho em grupos menores.");
            onProgress?.(index + 1, valid.length);
        }

        const outputParts = [];
        for (const entry of entries) {
            const header = new Uint8Array(30 + entry.nameBytes.length);
            const view = new DataView(header.buffer);
            writeZipUint32(view, 0, 0x04034b50);
            writeZipUint16(view, 4, 20);
            writeZipUint16(view, 6, 0x0800);
            writeZipUint16(view, 8, 0);
            writeZipUint16(view, 10, entry.dos.time);
            writeZipUint16(view, 12, entry.dos.date);
            writeZipUint32(view, 14, entry.crc32);
            writeZipUint32(view, 18, entry.size);
            writeZipUint32(view, 22, entry.size);
            writeZipUint16(view, 26, entry.nameBytes.length);
            writeZipUint16(view, 28, 0);
            header.set(entry.nameBytes, 30);
            outputParts.push(header, entry.blob);
        }

        const centralOffset = localOffset;
        let centralSize = 0;
        for (const entry of entries) {
            const header = new Uint8Array(46 + entry.nameBytes.length);
            const view = new DataView(header.buffer);
            writeZipUint32(view, 0, 0x02014b50);
            writeZipUint16(view, 4, 20);
            writeZipUint16(view, 6, 20);
            writeZipUint16(view, 8, 0x0800);
            writeZipUint16(view, 10, 0);
            writeZipUint16(view, 12, entry.dos.time);
            writeZipUint16(view, 14, entry.dos.date);
            writeZipUint32(view, 16, entry.crc32);
            writeZipUint32(view, 20, entry.size);
            writeZipUint32(view, 24, entry.size);
            writeZipUint16(view, 28, entry.nameBytes.length);
            writeZipUint16(view, 30, 0);
            writeZipUint16(view, 32, 0);
            writeZipUint16(view, 34, 0);
            writeZipUint16(view, 36, 0);
            writeZipUint32(view, 38, 0);
            writeZipUint32(view, 42, entry.offset);
            header.set(entry.nameBytes, 46);
            outputParts.push(header);
            centralSize += header.length;
        }

        const end = new Uint8Array(22);
        const endView = new DataView(end.buffer);
        writeZipUint32(endView, 0, 0x06054b50);
        writeZipUint16(endView, 4, 0);
        writeZipUint16(endView, 6, 0);
        writeZipUint16(endView, 8, entries.length);
        writeZipUint16(endView, 10, entries.length);
        writeZipUint32(endView, 12, centralSize);
        writeZipUint32(endView, 16, centralOffset);
        writeZipUint16(endView, 20, 0);
        outputParts.push(end);

        return new Blob(outputParts, { type: "application/zip" });
    }

    function derivePdfOutputZipName(files, toolId) {
        const first = String(files?.[0]?.fileName || toolId || "docspace");
        const base = first
            .replace(/_parte_\d+\.pdf$/i, "")
            .replace(/-pagina-\d+\.(pdf|png|jpe?g)$/i, "")
            .replace(/\.[^.]+$/i, "")
            .replace(/[^a-zA-Z0-9À-ÿ._ -]/g, "-")
            .trim() || "docspace";
        return `${base}-todos-os-${files.length}-arquivos.zip`;
    }

    async function downloadPdfOutputCollection(files, toolId) {
        const valid = (Array.isArray(files) ? files : []).filter((item) => item?.blob instanceof Blob);
        if (!valid.length) throw new Error("A ferramenta não retornou arquivos válidos.");
        if (valid.length === 1) {
            saveBlob(valid[0].blob, valid[0].fileName || `${toolId || "pdf"}.pdf`);
            return { message: "Download iniciado." };
        }
        showPdfToolProgress(88, `Empacotando ${valid.length} arquivos em um ZIP...`);
        const zipBlob = await createPdfOutputZip(valid, (done, total) => {
            const progress = 88 + Math.round((done / Math.max(1, total)) * 10);
            showPdfToolProgress(Math.min(98, progress), `Incluindo arquivo ${done}/${total} no ZIP...`);
        });
        const zipName = derivePdfOutputZipName(valid, toolId);
        saveBlob(zipBlob, zipName);
        return { message: `Todas as ${valid.length} partes foram incluídas em “${zipName}”.` };
    }

    function saveBlob(blob, fileName) {
        if (!(blob instanceof Blob)) {
            throw new Error("Arquivo inválido para download.");
        }

        if (window.saveAs) {
            window.saveAs(blob, fileName);
            return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = fileName || "documento.docx";
        a.rel = "noopener";
        a.style.display = "none";

        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
    function fileToDataUrl(file) {
        return blobToBase64(file, false);
    }

    async function blobToBase64(blob, stripPrefix = false) {
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return stripPrefix ? String(dataUrl).replace(/^data:[^;]+;base64,/, "") : dataUrl;
    }
    function formatLabel(name) { return String(name || "").replace(/[_-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()).replace(/Cpf/g, "CPF").replace(/Cnpj/g, "CNPJ").replace(/Rg/g, "RG").replace(/Uf/g, "UF"); }
    function placeholderFor(name) {
        const n = normalize(name);
        if (n.includes("cpf")) return "000.000.000-00";
        if (n.includes("cnpj")) return "00.000.000/0000-00";
        if (n.includes("data")) return "01/07/2026";
        if (n.includes("valor") || n.includes("renda")) return "R$ 0,00";
        if (n.includes("cidade") || n.includes("municipio")) return "Amargosa";
        if (n.includes("uf")) return "BA";
        return "";
    }
    function smartAttributesFor(name, label = "") {
        const type = smartFieldType(name, label);
        if (type === "cpfcnpj") return 'inputmode="numeric" maxlength="18"';
        if (type === "phone") return 'inputmode="tel" maxlength="15"';
        if (type === "cep") return 'inputmode="numeric" maxlength="9"';
        if (type === "date") return 'inputmode="numeric" maxlength="10"';
        if (type === "money") return 'inputmode="decimal"';
        const n = normalize(name);
        return n.includes("ano") ? 'inputmode="numeric"' : "";
    }
    function inputModeFor(name) { return smartAttributesFor(name); }
    function isLongField(name, label) { const n = normalize(`${name} ${label}`); return ["endereco","descricao","observacoes","confront","documentos","membros","atividade","produtos","benfeitorias","finalidade"].some((t) => n.includes(t)); }
    function chunkFields(fields, size) { const out = []; for (let i = 0; i < fields.length; i += size) out.push(fields.slice(i, i + size)); return out.length ? out : [[]]; }
    function categoryLabel(id) { return CATEGORIES.find((c) => c.id === id)?.label || "Documentos"; }
    function isAdmin() { return Boolean(state.user?.isAdmin || state.user?.is_admin); }
    function initials(value) { return String(value || "DS").split(/\s+|@/).filter(Boolean).slice(0,2).map((p) => p[0]?.toUpperCase()).join("") || "DS"; }
    function formatDate(value) { if (!value) return "Não informado"; const d = new Date(value); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString("pt-BR"); }
    function formatDateTime(value) {
        if (!value) return "Não informado";
        const raw = String(value).trim();
        // O D1 costuma retornar CURRENT_TIMESTAMP como YYYY-MM-DD HH:mm:ss em UTC.
        const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)
            ? `${raw.replace(" ", "T")}Z`
            : raw;
        const date = new Date(normalized);
        if (Number.isNaN(date.getTime())) return raw;
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "America/Sao_Paulo",
            }).format(date);
        } catch (_) {
            return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
        }
    }
    function normalize(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
    function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
    function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
    function translateError(error) {
        const text = error?.data?.message || error?.message || "Erro inesperado.";
        if (/Failed to fetch|NetworkError|Load failed|Não foi possível conectar ao Worker/i.test(text)) {
            return "Não foi possível conectar ao Worker. Confira a URL em app-config.js, o deploy e o CORS do Cloudflare.";
        }
        if (/Sem saldo|saldo disponível/i.test(text)) {
            return "Sem saldo disponível para este documento. Aguarde a renovação diária ou faça upgrade do plano.";
        }
        if (/Bibliotecas DOCX|PizZip|docxtemplater/i.test(text)) {
            return "Bibliotecas de geração Word não carregaram. Recarregue a página (Ctrl+F5) e verifique a conexão.";
        }
        if (/Modelo não encontrado|Modelo Word não configurado/i.test(text)) {
            return text;
        }
        if (/convers[aã]o|Render|preview-pdf|502|503/i.test(text)) {
            return "Falha na conversão para PDF no servidor. O Word ainda pode ser gerado; tente o PDF em instantes.";
        }
        return text;
    }
    function toast(text, type = "") {
        refs.toast.textContent = text;
        refs.toast.className = `toast ${type || ""}`.trim();
        refs.toast.classList.remove("is-hidden");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => refs.toast.classList.add("is-hidden"), 4200);
    }
    function initIcons() { if (window.lucide?.createIcons) window.lucide.createIcons(); }
})();

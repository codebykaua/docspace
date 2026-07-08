
(() => {
    "use strict";

    const API_BASE_URL = String(window.DOCSPACE_CONFIG?.API_BASE_URL || "").trim().replace(/\/+$/, "");
    // Expose globally for other modules (pdf-preview.js, etc.)
    window.API_BASE_URL = API_BASE_URL;
    const SESSION_TOKEN_KEY = "documentos_rurais_session_token";
    const BILLING_TOKEN_KEY = "documentos_rurais_billing_token";
    const APP_VERSION = "6.0.0-zero-wizard";
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
                "wide": false
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
                "name": "oque_produz",
                "label": "O que o comodatário produz",
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
                "wide": false
            },
            {
                "name": "município_comandatrio",
                "label": "Município do comodatário",
                "wide": false
            },
            {
                "name": "localidade_proxima_comandatario",
                "label": "Comunidade ou localidade próxima",
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
                "wide": false
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
                "name": "duração_contrato",
                "label": "Duração do contrato",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início na propriedade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês da assinatura",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "nome_conjuge",
                "label": "Nome completo do cônjuge/companheiro(a)",
                "wide": true
            },
            {
                "name": "nacionalidade_conjuge",
                "label": "Nacionalidade do cônjuge/companheiro(a)",
                "wide": true
            },
            {
                "name": "estado_civil_conjuge",
                "label": "Estado civil do cônjuge/companheiro(a)",
                "wide": true
            },
            {
                "name": "profissao_conjuge",
                "label": "Profissão do cônjuge/companheiro(a)",
                "wide": true
            },
            {
                "name": "rg_conjuge",
                "label": "RG do cônjuge/companheiro(a)",
                "wide": false
            },
            {
                "name": "cpf_conjuge",
                "label": "CPF do cônjuge/companheiro(a)",
                "wide": false
            },
            {
                "name": "localidade_conjuge",
                "label": "Localidade do cônjuge/companheiro(a)",
                "wide": true
            },
            {
                "name": "localidade_proxima_conjuge",
                "label": "Comunidade ou localidade próxima do cônjuge/companheiro(a)",
                "wide": true
            },
            {
                "name": "municipio_conjuge",
                "label": "Município do cônjuge/companheiro(a)",
                "wide": true
            },
            {
                "name": "data_falecimento",
                "label": "Data do falecimento",
                "wide": false
            },
            {
                "name": "numero_obito",
                "label": "Número do óbito",
                "wide": false
            },
            {
                "name": "representante_do_falecido",
                "label": "Nome completo do representante do falecido",
                "wide": true
            },
            {
                "name": "parentesco_representante",
                "label": "Parentesco do representante",
                "wide": false
            },
            {
                "name": "rg_representante",
                "label": "RG do representante",
                "wide": false
            },
            {
                "name": "cpf_representante",
                "label": "CPF do representante",
                "wide": false
            },
            {
                "name": "endereco_representante",
                "label": "Endereço do representante",
                "wide": true
            }
        ],
        "choices": [
            {
                "name": "possui_conjuge",
                "label": "Possui cônjuge/companheiro(a)?",
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
                "label": "Existe óbito/falecido no contrato?",
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
                "label": "Nome Representante",
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
                "name": "endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "localidade",
                "label": "Localidade",
                "wide": false
            },
            {
                "name": "produto1",
                "label": "Produto1",
                "wide": false
            },
            {
                "name": "valor1",
                "label": "Valor1",
                "wide": false
            },
            {
                "name": "produto2",
                "label": "Produto2",
                "wide": false
            },
            {
                "name": "valor2",
                "label": "Valor2",
                "wide": false
            },
            {
                "name": "produto3",
                "label": "Produto3",
                "wide": false
            },
            {
                "name": "valor3",
                "label": "Valor3",
                "wide": false
            },
            {
                "name": "valor_total_numeros",
                "label": "Valor Total Numeros",
                "wide": false
            },
            {
                "name": "valor_total_escrito",
                "label": "Valor Total Escrito",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mês",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome do representante",
                "label": "Nome Do Representante",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "Localidade",
                "label": "Localidade",
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
                "label": "Nome Representante",
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
                "name": "endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "localidade",
                "label": "Localidade",
                "wide": false
            },
            {
                "name": "nome_mebro",
                "label": "Nome Mebro",
                "wide": false
            },
            {
                "name": "tipo_renda",
                "label": "Tipo Renda",
                "wide": true
            },
            {
                "name": "valor_anual",
                "label": "Valor Anual",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mês",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome do representante",
                "label": "Nome Do Representante",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "Localidade",
                "label": "Localidade",
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
                "label": "Nome Posseiro",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado Civil",
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
                "name": "endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "nome_imovel",
                "label": "Nome do imóvel rural",
                "wide": false
            },
            {
                "name": "área_total_imovel",
                "label": "Área Total Imovel",
                "wide": false
            },
            {
                "name": "período_numero",
                "label": "Período Numero",
                "wide": false
            },
            {
                "name": "período_extenso",
                "label": "Período Extenso",
                "wide": false
            },
            {
                "name": "ao_norte",
                "label": "Ao Norte",
                "wide": false
            },
            {
                "name": "cpf_norte",
                "label": "CPF Norte",
                "wide": false
            },
            {
                "name": "ao_sul",
                "label": "Ao Sul",
                "wide": false
            },
            {
                "name": "cpf_sul",
                "label": "CPF Sul",
                "wide": false
            },
            {
                "name": "ao_leste",
                "label": "Ao Leste",
                "wide": false
            },
            {
                "name": "cpf_leste",
                "label": "CPF Leste",
                "wide": false
            },
            {
                "name": "ao_oeste",
                "label": "Ao Oeste",
                "wide": false
            },
            {
                "name": "cpf_oeste",
                "label": "CPF Oeste",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mês",
                "label": "Mês",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome do posseiro",
                "label": "Nome Do Posseiro",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
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
                "name": "possui_representacao",
                "label": "Possui Representacao",
                "wide": false
            },
            {
                "name": "nome_segurado",
                "label": "Nome Segurado",
                "wide": false
            },
            {
                "name": "apelido_segurado",
                "label": "Apelido Segurado",
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
                "name": "data_nascimento",
                "label": "Data Nascimento",
                "wide": false
            },
            {
                "name": "local_nascimento",
                "label": "Local Nascimento",
                "wide": false
            },
            {
                "name": "estado_civil_segurado",
                "label": "Estado Civil Segurado",
                "wide": false
            },
            {
                "name": "escolaridade_segurado",
                "label": "Escolaridade Segurado",
                "wide": false
            },
            {
                "name": "cor_raca_segurado",
                "label": "Cor Raca Segurado",
                "wide": false
            },
            {
                "name": "telefone1_segurado",
                "label": "Telefone1 Segurado",
                "wide": false
            },
            {
                "name": "telefone2_segurado",
                "label": "Telefone2 Segurado",
                "wide": false
            },
            {
                "name": "endereco_segurado",
                "label": "Endereco Segurado",
                "wide": true
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
                "name": "local_expedicao",
                "label": "Local Expedicao",
                "wide": false
            },
            {
                "name": "data_emissao",
                "label": "Data Emissao",
                "wide": false
            },
            {
                "name": "beneficio",
                "label": "Beneficio",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês da assinatura",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "periodos_atividade_rural",
                "label": "Periodos Atividade Rural",
                "wide": true
            },
            {
                "name": "periodo_inicial_1",
                "label": "Periodo Inicial 1",
                "wide": false
            },
            {
                "name": "periodo_final_1",
                "label": "Periodo Final 1",
                "wide": false
            },
            {
                "name": "condicao_1",
                "label": "Condicao 1",
                "wide": false
            },
            {
                "name": "situacao_individual_1",
                "label": "Situacao Individual 1",
                "wide": false
            },
            {
                "name": "situacao_regime_1",
                "label": "Situacao Regime 1",
                "wide": false
            },
            {
                "name": "periodo_inicial_2",
                "label": "Periodo Inicial 2",
                "wide": false
            },
            {
                "name": "periodo_final_2",
                "label": "Periodo Final 2",
                "wide": false
            },
            {
                "name": "condicao_2",
                "label": "Condicao 2",
                "wide": false
            },
            {
                "name": "situacao_individual_2",
                "label": "Situacao Individual 2",
                "wide": false
            },
            {
                "name": "situacao_regime_2",
                "label": "Situacao Regime 2",
                "wide": false
            },
            {
                "name": "periodo_inicial_3",
                "label": "Periodo Inicial 3",
                "wide": false
            },
            {
                "name": "periodo_final_3",
                "label": "Periodo Final 3",
                "wide": false
            },
            {
                "name": "condicao_3",
                "label": "Condicao 3",
                "wide": false
            },
            {
                "name": "situacao_individual_3",
                "label": "Situacao Individual 3",
                "wide": false
            },
            {
                "name": "situacao_regime_3",
                "label": "Situacao Regime 3",
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
                "name": "familiares",
                "label": "Familiares",
                "wide": false
            },
            {
                "name": "nome_familiar_1",
                "label": "Nome Familiar 1",
                "wide": false
            },
            {
                "name": "dn_familiar_1",
                "label": "Dn Familiar 1",
                "wide": false
            },
            {
                "name": "cpf_familiar_1",
                "label": "CPF Familiar 1",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_1",
                "label": "Estado Civil Familiar 1",
                "wide": false
            },
            {
                "name": "parentesco_familiar_1",
                "label": "Parentesco Familiar 1",
                "wide": false
            },
            {
                "name": "nome_familiar_2",
                "label": "Nome Familiar 2",
                "wide": false
            },
            {
                "name": "dn_familiar_2",
                "label": "Dn Familiar 2",
                "wide": false
            },
            {
                "name": "cpf_familiar_2",
                "label": "CPF Familiar 2",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_2",
                "label": "Estado Civil Familiar 2",
                "wide": false
            },
            {
                "name": "parentesco_familiar_2",
                "label": "Parentesco Familiar 2",
                "wide": false
            },
            {
                "name": "nome_familiar_3",
                "label": "Nome Familiar 3",
                "wide": false
            },
            {
                "name": "dn_familiar_3",
                "label": "Dn Familiar 3",
                "wide": false
            },
            {
                "name": "cpf_familiar_3",
                "label": "CPF Familiar 3",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_3",
                "label": "Estado Civil Familiar 3",
                "wide": false
            },
            {
                "name": "parentesco_familiar_3",
                "label": "Parentesco Familiar 3",
                "wide": false
            },
            {
                "name": "nome_familiar_4",
                "label": "Nome Familiar 4",
                "wide": false
            },
            {
                "name": "dn_familiar_4",
                "label": "Dn Familiar 4",
                "wide": false
            },
            {
                "name": "cpf_familiar_4",
                "label": "CPF Familiar 4",
                "wide": false
            },
            {
                "name": "estado_civil_familiar_4",
                "label": "Estado Civil Familiar 4",
                "wide": false
            },
            {
                "name": "parentesco_familiar_4",
                "label": "Parentesco Familiar 4",
                "wide": false
            },
            {
                "name": "terras",
                "label": "Terras",
                "wide": false
            },
            {
                "name": "itr_terra_1",
                "label": "Itr Terra 1",
                "wide": false
            },
            {
                "name": "nome_propiedade_1",
                "label": "Nome Propiedade 1",
                "wide": false
            },
            {
                "name": "municipio_uf_1",
                "label": "Municipio UF 1",
                "wide": false
            },
            {
                "name": "area_total_1",
                "label": "Area Total 1",
                "wide": false
            },
            {
                "name": "area_explorada_1",
                "label": "Area Explorada 1",
                "wide": false
            },
            {
                "name": "nome_proprietario_1",
                "label": "Nome Proprietario 1",
                "wide": false
            },
            {
                "name": "cpf_proprietario_1",
                "label": "CPF Proprietario 1",
                "wide": false
            },
            {
                "name": "itr_terra_2",
                "label": "Itr Terra 2",
                "wide": false
            },
            {
                "name": "nome_propiedade_2",
                "label": "Nome Propiedade 2",
                "wide": false
            },
            {
                "name": "municipio_uf_2",
                "label": "Municipio UF 2",
                "wide": false
            },
            {
                "name": "area_total_2",
                "label": "Area Total 2",
                "wide": false
            },
            {
                "name": "area_explorada_2",
                "label": "Area Explorada 2",
                "wide": false
            },
            {
                "name": "nome_proprietario_2",
                "label": "Nome Proprietario 2",
                "wide": false
            },
            {
                "name": "cpf_proprietario_2",
                "label": "CPF Proprietario 2",
                "wide": false
            },
            {
                "name": "itr_terra_3",
                "label": "Itr Terra 3",
                "wide": false
            },
            {
                "name": "nome_propiedade_3",
                "label": "Nome Propiedade 3",
                "wide": false
            },
            {
                "name": "municipio_uf_3",
                "label": "Municipio UF 3",
                "wide": false
            },
            {
                "name": "area_total_3",
                "label": "Area Total 3",
                "wide": false
            },
            {
                "name": "area_explorada_3",
                "label": "Area Explorada 3",
                "wide": false
            },
            {
                "name": "nome_proprietario_3",
                "label": "Nome Proprietario 3",
                "wide": false
            },
            {
                "name": "cpf_proprietario_3",
                "label": "CPF Proprietario 3",
                "wide": false
            },
            {
                "name": "itr_terra_4",
                "label": "Itr Terra 4",
                "wide": false
            },
            {
                "name": "nome_propiedade_4",
                "label": "Nome Propiedade 4",
                "wide": false
            },
            {
                "name": "municipio_uf_4",
                "label": "Municipio UF 4",
                "wide": false
            },
            {
                "name": "area_total_4",
                "label": "Area Total 4",
                "wide": false
            },
            {
                "name": "area_explorada_4",
                "label": "Area Explorada 4",
                "wide": false
            },
            {
                "name": "nome_proprietario_4",
                "label": "Nome Proprietario 4",
                "wide": false
            },
            {
                "name": "cpf_proprietario_4",
                "label": "CPF Proprietario 4",
                "wide": false
            },
            {
                "name": "atividades_rurais",
                "label": "Atividades Rurais",
                "wide": true
            },
            {
                "name": "atividade_rural_1",
                "label": "Atividade Rural 1",
                "wide": true
            },
            {
                "name": "subsistencia_venda_1",
                "label": "Subsistencia Venda 1",
                "wide": false
            },
            {
                "name": "atividade_rural_2",
                "label": "Atividade Rural 2",
                "wide": true
            },
            {
                "name": "subsistencia_venda_2",
                "label": "Subsistencia Venda 2",
                "wide": false
            },
            {
                "name": "atividade_rural_3",
                "label": "Atividade Rural 3",
                "wide": true
            },
            {
                "name": "subsistencia_venda_3",
                "label": "Subsistencia Venda 3",
                "wide": false
            },
            {
                "name": "houve_ipi",
                "label": "Houve Ipi",
                "wide": false
            },
            {
                "name": "ipi_periodo_1",
                "label": "Ipi Periodo 1",
                "wide": false
            },
            {
                "name": "ipi_periodo_2",
                "label": "Ipi Periodo 2",
                "wide": false
            },
            {
                "name": "possui_empregados",
                "label": "Possui Empregados",
                "wide": false
            },
            {
                "name": "empregado_nome_1",
                "label": "Empregado Nome 1",
                "wide": false
            },
            {
                "name": "empregado_cpf_1",
                "label": "Empregado CPF 1",
                "wide": false
            },
            {
                "name": "empregado_periodo_1",
                "label": "Empregado Periodo 1",
                "wide": false
            },
            {
                "name": "empregado_nome_2",
                "label": "Empregado Nome 2",
                "wide": false
            },
            {
                "name": "empregado_cpf_2",
                "label": "Empregado CPF 2",
                "wide": false
            },
            {
                "name": "empregado_periodo_2",
                "label": "Empregado Periodo 2",
                "wide": false
            },
            {
                "name": "empregado_nome_3",
                "label": "Empregado Nome 3",
                "wide": false
            },
            {
                "name": "empregado_cpf_3",
                "label": "Empregado CPF 3",
                "wide": false
            },
            {
                "name": "empregado_periodo_3",
                "label": "Empregado Periodo 3",
                "wide": false
            },
            {
                "name": "possui_outra_atividade",
                "label": "Possui Outra Atividade",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_1",
                "label": "Outra Atividade Renda 1",
                "wide": true
            },
            {
                "name": "outra_atividade_local_1",
                "label": "Outra Atividade Local 1",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_1",
                "label": "Outra Atividade Periodo 1",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_2",
                "label": "Outra Atividade Renda 2",
                "wide": true
            },
            {
                "name": "outra_atividade_local_2",
                "label": "Outra Atividade Local 2",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_2",
                "label": "Outra Atividade Periodo 2",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_3",
                "label": "Outra Atividade Renda 3",
                "wide": true
            },
            {
                "name": "outra_atividade_local_3",
                "label": "Outra Atividade Local 3",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_3",
                "label": "Outra Atividade Periodo 3",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_4",
                "label": "Outra Atividade Renda 4",
                "wide": true
            },
            {
                "name": "outra_atividade_local_4",
                "label": "Outra Atividade Local 4",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_4",
                "label": "Outra Atividade Periodo 4",
                "wide": true
            },
            {
                "name": "outra_atividade_renda_5",
                "label": "Outra Atividade Renda 5",
                "wide": true
            },
            {
                "name": "outra_atividade_local_5",
                "label": "Outra Atividade Local 5",
                "wide": true
            },
            {
                "name": "outra_atividade_periodo_5",
                "label": "Outra Atividade Periodo 5",
                "wide": true
            },
            {
                "name": "possui_outra_renda",
                "label": "Possui Outra Renda",
                "wide": true
            },
            {
                "name": "outra_renda_atividade_1",
                "label": "Outra Renda Atividade 1",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_1",
                "label": "Outra Renda Periodo 1",
                "wide": true
            },
            {
                "name": "outra_renda_valor_1",
                "label": "Outra Renda Valor 1",
                "wide": true
            },
            {
                "name": "outra_renda_informacoes_1",
                "label": "Outra Renda Informacoes 1",
                "wide": true
            },
            {
                "name": "outra_renda_atividade_2",
                "label": "Outra Renda Atividade 2",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_2",
                "label": "Outra Renda Periodo 2",
                "wide": true
            },
            {
                "name": "outra_renda_valor_2",
                "label": "Outra Renda Valor 2",
                "wide": true
            },
            {
                "name": "outra_renda_informacoes_2",
                "label": "Outra Renda Informacoes 2",
                "wide": true
            },
            {
                "name": "outra_renda_atividade_3",
                "label": "Outra Renda Atividade 3",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_3",
                "label": "Outra Renda Periodo 3",
                "wide": true
            },
            {
                "name": "outra_renda_valor_3",
                "label": "Outra Renda Valor 3",
                "wide": true
            },
            {
                "name": "outra_renda_informacoes_3",
                "label": "Outra Renda Informacoes 3",
                "wide": true
            },
            {
                "name": "outra_renda_atividade_4",
                "label": "Outra Renda Atividade 4",
                "wide": true
            },
            {
                "name": "outra_renda_periodo_4",
                "label": "Outra Renda Periodo 4",
                "wide": true
            },
            {
                "name": "outra_renda_valor_4",
                "label": "Outra Renda Valor 4",
                "wide": true
            },
            {
                "name": "outra_renda_informacoes_4",
                "label": "Outra Renda Informacoes 4",
                "wide": true
            },
            {
                "name": "participa_cooperativa",
                "label": "Participa Cooperativa",
                "wide": false
            },
            {
                "name": "cooperativa_entidade",
                "label": "Cooperativa Entidade",
                "wide": false
            },
            {
                "name": "cooperativa_cnpj",
                "label": "Cooperativa CNPJ",
                "wide": false
            },
            {
                "name": "cooperativa_tipo",
                "label": "Cooperativa Tipo",
                "wide": false
            },
            {
                "name": "Nome do segurado",
                "label": "Nome Do Segurado",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Apelido",
                "label": "Apelido",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "Data de nascimento",
                "label": "Data De Nascimento",
                "wide": false
            },
            {
                "name": "Ex.: 10/05/1975",
                "label": "Ex.: 10/05/1975",
                "wide": false
            },
            {
                "name": "Local de nascimento",
                "label": "Local De Nascimento",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Casado (a)",
                "label": "Ex.: Casado (a)",
                "wide": false
            },
            {
                "name": "Escolaridade",
                "label": "Escolaridade",
                "wide": false
            },
            {
                "name": "Cor/Raça",
                "label": "Cor/raça",
                "wide": false
            },
            {
                "name": "Telefone 1",
                "label": "Telefone 1",
                "wide": false
            },
            {
                "name": "Telefone 2",
                "label": "Telefone 2",
                "wide": false
            },
            {
                "name": "Endereço residencial",
                "label": "Endereço Residencial",
                "wide": true
            },
            {
                "name": "Cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "Ex.: Amargosa",
                "label": "Ex.: Amargosa",
                "wide": false
            },
            {
                "name": "UF",
                "label": "UF",
                "wide": false
            },
            {
                "name": "Ex.: BA",
                "label": "Ex.: Ba",
                "wide": false
            },
            {
                "name": "Local de expedição do RG",
                "label": "Local De Expedição Do RG",
                "wide": false
            },
            {
                "name": "Data de emissão do RG",
                "label": "Data De Emissão Do RG",
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
                "label": "Possui representação?",
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
        "id": "procuracao-consumidor",
        "title": "Procuração Consumidor",
        "description": "Preencha os dados da pessoa, endereço, telefone e data para gerar a procuração consumidor.",
        "category": "procuracoes",
        "fileName": "procuracao-consumidor.docx",
        "fields": [
            {
                "name": "nome_pessoa",
                "label": "Nome Pessoa",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissao",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado Civil",
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
                "label": "Endereco",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês da assinatura",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome completo",
                "label": "Nome Completo",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Profissão",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "Ex.: lavrador",
                "label": "Ex.: Lavrador",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "tel",
                "label": "Tel",
                "wide": false
            },
            {
                "name": "(00) 00000-0000",
                "label": "(00) 00000 0000",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "Rua, número, bairro ou localidade",
                "label": "Rua, Número, Bairro Ou Localidade",
                "wide": true
            },
            {
                "name": "Município",
                "label": "Município",
                "wide": false
            },
            {
                "name": "Ex.: Amargosa",
                "label": "Ex.: Amargosa",
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
                "label": "Nome Pessoa",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissao",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado Civil",
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
                "label": "Endereco",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês da assinatura",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome completo",
                "label": "Nome Completo",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Profissão",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "Ex.: lavrador",
                "label": "Ex.: Lavrador",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "tel",
                "label": "Tel",
                "wide": false
            },
            {
                "name": "(00) 00000-0000",
                "label": "(00) 00000 0000",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "Rua, número, bairro ou localidade",
                "label": "Rua, Número, Bairro Ou Localidade",
                "wide": true
            },
            {
                "name": "Município",
                "label": "Município",
                "wide": false
            },
            {
                "name": "Ex.: Amargosa",
                "label": "Ex.: Amargosa",
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
                "label": "Nome Pessoa",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissao",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado Civil",
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
                "label": "Endereco",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês da assinatura",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome completo",
                "label": "Nome Completo",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Profissão",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "Ex.: lavrador",
                "label": "Ex.: Lavrador",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "tel",
                "label": "Tel",
                "wide": false
            },
            {
                "name": "(00) 00000-0000",
                "label": "(00) 00000 0000",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "Rua, número, bairro ou localidade",
                "label": "Rua, Número, Bairro Ou Localidade",
                "wide": true
            },
            {
                "name": "Município",
                "label": "Município",
                "wide": false
            },
            {
                "name": "Ex.: Amargosa",
                "label": "Ex.: Amargosa",
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
                "label": "Nome Pessoa",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissao",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado Civil",
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
                "label": "Endereco",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês da assinatura",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome completo",
                "label": "Nome Completo",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Profissão",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "Ex.: lavrador",
                "label": "Ex.: Lavrador",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Telefone",
                "label": "Telefone",
                "wide": false
            },
            {
                "name": "tel",
                "label": "Tel",
                "wide": false
            },
            {
                "name": "(00) 00000-0000",
                "label": "(00) 00000 0000",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "Rua, número, bairro ou localidade",
                "label": "Rua, Número, Bairro Ou Localidade",
                "wide": true
            },
            {
                "name": "Município",
                "label": "Município",
                "wide": false
            },
            {
                "name": "Ex.: Amargosa",
                "label": "Ex.: Amargosa",
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
                "label": "Nome Pessoa",
                "wide": false
            },
            {
                "name": "profissao",
                "label": "Profissao",
                "wide": false
            },
            {
                "name": "estado_civil",
                "label": "Estado Civil",
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
                "label": "Endereco",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "cidade",
                "label": "Cidade",
                "wide": false
            },
            {
                "name": "dia",
                "label": "Dia da assinatura",
                "wide": false
            },
            {
                "name": "mes",
                "label": "Mês da assinatura",
                "wide": false
            },
            {
                "name": "ano",
                "label": "Ano da assinatura",
                "wide": false
            },
            {
                "name": "Nome completo",
                "label": "Nome Completo",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Profissão",
                "label": "Profissão",
                "wide": false
            },
            {
                "name": "Ex.: lavrador",
                "label": "Ex.: Lavrador",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Endereço",
                "label": "Endereço",
                "wide": true
            },
            {
                "name": "Rua, número, bairro ou localidade",
                "label": "Rua, Número, Bairro Ou Localidade",
                "wide": true
            },
            {
                "name": "Município",
                "label": "Município",
                "wide": false
            },
            {
                "name": "Ex.: Amargosa",
                "label": "Ex.: Amargosa",
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
                "label": "Nome Vendedor",
                "wide": false
            },
            {
                "name": "nacionalidade_vendedor",
                "label": "Nacionalidade Vendedor",
                "wide": false
            },
            {
                "name": "estado_civil_vendedor",
                "label": "Estado Civil Vendedor",
                "wide": false
            },
            {
                "name": "rg_vendedor",
                "label": "RG Vendedor",
                "wide": false
            },
            {
                "name": "cpf_vendedor",
                "label": "CPF Vendedor",
                "wide": false
            },
            {
                "name": "endereco_vendedor",
                "label": "Endereco Vendedor",
                "wide": true
            },
            {
                "name": "nome_comprador",
                "label": "Nome Comprador",
                "wide": false
            },
            {
                "name": "nacionalidade_comprador",
                "label": "Nacionalidade Comprador",
                "wide": false
            },
            {
                "name": "estado_civil_comprador",
                "label": "Estado Civil Comprador",
                "wide": false
            },
            {
                "name": "rg_comprador",
                "label": "RG Comprador",
                "wide": false
            },
            {
                "name": "cpf_comprador",
                "label": "CPF Comprador",
                "wide": false
            },
            {
                "name": "endereco_comprador",
                "label": "Endereco Comprador",
                "wide": true
            },
            {
                "name": "denominacao_imovel",
                "label": "Denominacao Imovel",
                "wide": false
            },
            {
                "name": "endereco_imovel",
                "label": "Endereco Imovel",
                "wide": true
            },
            {
                "name": "largura_imovel",
                "label": "Largura Imovel",
                "wide": false
            },
            {
                "name": "comprimento_imovel",
                "label": "Comprimento Imovel",
                "wide": false
            },
            {
                "name": "quantidade_bens",
                "label": "Quantidade Bens",
                "wide": false
            },
            {
                "name": "valor_venda",
                "label": "Valor Venda",
                "wide": false
            },
            {
                "name": "valor_venda_extenso",
                "label": "Valor Venda Extenso",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro Comarca",
                "wide": false
            },
            {
                "name": "Nome do vendedor",
                "label": "Nome Do Vendedor",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Nacionalidade",
                "label": "Nacionalidade",
                "wide": false
            },
            {
                "name": "Ex.: brasileira",
                "label": "Ex.: Brasileira",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Endereço do vendedor",
                "label": "Endereço Do Vendedor",
                "wide": true
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
                "label": "Nome Vendedor",
                "wide": false
            },
            {
                "name": "nacionalidade_vendedor",
                "label": "Nacionalidade Vendedor",
                "wide": false
            },
            {
                "name": "estado_civil_vendedor",
                "label": "Estado Civil Vendedor",
                "wide": false
            },
            {
                "name": "rg_vendedor",
                "label": "RG Vendedor",
                "wide": false
            },
            {
                "name": "cpf_vendedor",
                "label": "CPF Vendedor",
                "wide": false
            },
            {
                "name": "endereco_vendedor",
                "label": "Endereco Vendedor",
                "wide": true
            },
            {
                "name": "nome_comprador",
                "label": "Nome Comprador",
                "wide": false
            },
            {
                "name": "nacionalidade_comprador",
                "label": "Nacionalidade Comprador",
                "wide": false
            },
            {
                "name": "estado_civil_comprador",
                "label": "Estado Civil Comprador",
                "wide": false
            },
            {
                "name": "rg_comprador",
                "label": "RG Comprador",
                "wide": false
            },
            {
                "name": "cpf_comprador",
                "label": "CPF Comprador",
                "wide": false
            },
            {
                "name": "endereco_comprador",
                "label": "Endereco Comprador",
                "wide": true
            },
            {
                "name": "tipo_bem",
                "label": "Tipo Bem",
                "wide": false
            },
            {
                "name": "marca_bem",
                "label": "Marca Bem",
                "wide": false
            },
            {
                "name": "modelo_bem",
                "label": "Modelo Bem",
                "wide": false
            },
            {
                "name": "ano_modelo_bem",
                "label": "Ano Modelo Bem",
                "wide": false
            },
            {
                "name": "cor_bem",
                "label": "Cor Bem",
                "wide": false
            },
            {
                "name": "placa_veiculo",
                "label": "Placa Veiculo",
                "wide": false
            },
            {
                "name": "renavam_veiculo",
                "label": "Renavam Veiculo",
                "wide": false
            },
            {
                "name": "chassi_ou_serie",
                "label": "Chassi Ou Serie",
                "wide": false
            },
            {
                "name": "quilometragem_veiculo",
                "label": "Quilometragem Veiculo",
                "wide": false
            },
            {
                "name": "estado_conservacao_bem",
                "label": "Estado Conservacao Bem",
                "wide": false
            },
            {
                "name": "descricao_complementar_bem",
                "label": "Descricao Complementar Bem",
                "wide": true
            },
            {
                "name": "valor_venda",
                "label": "Valor Venda",
                "wide": false
            },
            {
                "name": "valor_venda_extenso",
                "label": "Valor Venda Extenso",
                "wide": false
            },
            {
                "name": "forma_pagamento",
                "label": "Forma Pagamento",
                "wide": false
            },
            {
                "name": "data_entrega_bem",
                "label": "Data Entrega Bem",
                "wide": false
            },
            {
                "name": "local_entrega_bem",
                "label": "Local Entrega Bem",
                "wide": false
            },
            {
                "name": "responsavel_transferencia",
                "label": "Responsavel Transferencia",
                "wide": false
            },
            {
                "name": "cpf_testemunha_1",
                "label": "CPF Testemunha 1",
                "wide": false
            },
            {
                "name": "cpf_testemunha_2",
                "label": "CPF Testemunha 2",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura",
                "label": "Data Assinatura",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro Comarca",
                "wide": false
            },
            {
                "name": "Nome do vendedor",
                "label": "Nome Do Vendedor",
                "wide": false
            },
            {
                "name": "name",
                "label": "Name",
                "wide": false
            },
            {
                "name": "Nacionalidade",
                "label": "Nacionalidade",
                "wide": false
            },
            {
                "name": "Ex.: brasileira",
                "label": "Ex.: Brasileira",
                "wide": false
            },
            {
                "name": "Estado civil",
                "label": "Estado Civil",
                "wide": false
            },
            {
                "name": "Ex.: Solteiro (a)",
                "label": "Ex.: Solteiro (a)",
                "wide": false
            },
            {
                "name": "RG",
                "label": "RG",
                "wide": false
            },
            {
                "name": "CPF",
                "label": "CPF",
                "wide": false
            },
            {
                "name": "numeric",
                "label": "Numeric",
                "wide": false
            },
            {
                "name": "000.000.000-00",
                "label": "000.000.000 00",
                "wide": false
            },
            {
                "name": "Endereço do vendedor",
                "label": "Endereço Do Vendedor",
                "wide": true
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
                "name": "area_imovel",
                "label": "Area Imovel",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_cnpj_confrontante_leste",
                "label": "CPF CNPJ Confrontante Leste",
                "wide": true
            },
            {
                "name": "cpf_cnpj_confrontante_norte",
                "label": "CPF CNPJ Confrontante Norte",
                "wide": true
            },
            {
                "name": "cpf_cnpj_confrontante_oeste",
                "label": "CPF CNPJ Confrontante Oeste",
                "wide": true
            },
            {
                "name": "cpf_cnpj_confrontante_sul",
                "label": "CPF CNPJ Confrontante Sul",
                "wide": true
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "endereco_confrontante_leste",
                "label": "Endereco Confrontante Leste",
                "wide": true
            },
            {
                "name": "endereco_confrontante_norte",
                "label": "Endereco Confrontante Norte",
                "wide": true
            },
            {
                "name": "endereco_confrontante_oeste",
                "label": "Endereco Confrontante Oeste",
                "wide": true
            },
            {
                "name": "endereco_confrontante_sul",
                "label": "Endereco Confrontante Sul",
                "wide": true
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco Imovel Rural",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "imovel_confrontante_leste",
                "label": "Imovel Confrontante Leste",
                "wide": true
            },
            {
                "name": "imovel_confrontante_norte",
                "label": "Imovel Confrontante Norte",
                "wide": true
            },
            {
                "name": "imovel_confrontante_oeste",
                "label": "Imovel Confrontante Oeste",
                "wide": true
            },
            {
                "name": "imovel_confrontante_sul",
                "label": "Imovel Confrontante Sul",
                "wide": true
            },
            {
                "name": "municipio_imovel",
                "label": "Municipio Imovel",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_confrontante_leste",
                "label": "Nome Confrontante Leste",
                "wide": true
            },
            {
                "name": "nome_confrontante_norte",
                "label": "Nome Confrontante Norte",
                "wide": true
            },
            {
                "name": "nome_confrontante_oeste",
                "label": "Nome Confrontante Oeste",
                "wide": true
            },
            {
                "name": "nome_confrontante_sul",
                "label": "Nome Confrontante Sul",
                "wide": true
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome Imovel Rural",
                "wide": false
            },
            {
                "name": "registro_imovel",
                "label": "Registro Imovel",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_imovel",
                "label": "UF Imovel",
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
                "name": "ano_referencia",
                "label": "Ano Referencia",
                "wide": false
            },
            {
                "name": "area_imovel",
                "label": "Area Imovel",
                "wide": false
            },
            {
                "name": "atividade_1",
                "label": "Atividade 1",
                "wide": true
            },
            {
                "name": "atividade_2",
                "label": "Atividade 2",
                "wide": true
            },
            {
                "name": "atividade_3",
                "label": "Atividade 3",
                "wide": true
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_produtor",
                "label": "CPF Produtor",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim_ano",
                "label": "Data Fim Ano",
                "wide": false
            },
            {
                "name": "data_inicio_ano",
                "label": "Data Inicio Ano",
                "wide": false
            },
            {
                "name": "despesas_anuais",
                "label": "Despesas Anuais",
                "wide": false
            },
            {
                "name": "despesas_anuais_extenso",
                "label": "Despesas Anuais Extenso",
                "wide": false
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco Imovel Rural",
                "wide": true
            },
            {
                "name": "endereco_produtor",
                "label": "Endereco Produtor",
                "wide": true
            },
            {
                "name": "estado_civil_produtor",
                "label": "Estado Civil Produtor",
                "wide": false
            },
            {
                "name": "estoque_final_1",
                "label": "Estoque Final 1",
                "wide": false
            },
            {
                "name": "estoque_final_2",
                "label": "Estoque Final 2",
                "wide": false
            },
            {
                "name": "estoque_final_3",
                "label": "Estoque Final 3",
                "wide": false
            },
            {
                "name": "municipio_imovel",
                "label": "Municipio Imovel",
                "wide": false
            },
            {
                "name": "nacionalidade_produtor",
                "label": "Nacionalidade Produtor",
                "wide": false
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome Imovel Rural",
                "wide": false
            },
            {
                "name": "nome_produtor",
                "label": "Nome Produtor",
                "wide": false
            },
            {
                "name": "quantidade_produzida_1",
                "label": "Quantidade Produzida 1",
                "wide": false
            },
            {
                "name": "quantidade_produzida_2",
                "label": "Quantidade Produzida 2",
                "wide": false
            },
            {
                "name": "quantidade_produzida_3",
                "label": "Quantidade Produzida 3",
                "wide": false
            },
            {
                "name": "quantidade_vendida_1",
                "label": "Quantidade Vendida 1",
                "wide": false
            },
            {
                "name": "quantidade_vendida_2",
                "label": "Quantidade Vendida 2",
                "wide": false
            },
            {
                "name": "quantidade_vendida_3",
                "label": "Quantidade Vendida 3",
                "wide": false
            },
            {
                "name": "receita_bruta_anual",
                "label": "Receita Bruta Anual",
                "wide": false
            },
            {
                "name": "receita_bruta_extenso",
                "label": "Receita Bruta Extenso",
                "wide": false
            },
            {
                "name": "registro_rural",
                "label": "Registro Rural",
                "wide": false
            },
            {
                "name": "rg_produtor",
                "label": "RG Produtor",
                "wide": false
            },
            {
                "name": "saldo_estimado",
                "label": "Saldo Estimado",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_imovel",
                "label": "UF Imovel",
                "wide": false
            },
            {
                "name": "unidade_1",
                "label": "Unidade 1",
                "wide": false
            },
            {
                "name": "unidade_2",
                "label": "Unidade 2",
                "wide": false
            },
            {
                "name": "unidade_3",
                "label": "Unidade 3",
                "wide": false
            },
            {
                "name": "valor_total_1",
                "label": "Valor Total 1",
                "wide": false
            },
            {
                "name": "valor_total_2",
                "label": "Valor Total 2",
                "wide": false
            },
            {
                "name": "valor_total_3",
                "label": "Valor Total 3",
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
                "name": "ano_controle",
                "label": "Ano Controle",
                "wide": false
            },
            {
                "name": "categoria_1",
                "label": "Categoria 1",
                "wide": false
            },
            {
                "name": "categoria_2",
                "label": "Categoria 2",
                "wide": false
            },
            {
                "name": "categoria_3",
                "label": "Categoria 3",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "controle_sanitario",
                "label": "Controle Sanitario",
                "wide": false
            },
            {
                "name": "cpf_produtor",
                "label": "CPF Produtor",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim_controle",
                "label": "Data Fim Controle",
                "wide": false
            },
            {
                "name": "data_inicio_controle",
                "label": "Data Inicio Controle",
                "wide": false
            },
            {
                "name": "endereco_produtor",
                "label": "Endereco Produtor",
                "wide": true
            },
            {
                "name": "endereco_propriedade",
                "label": "Endereco Propriedade",
                "wide": true
            },
            {
                "name": "entradas_1",
                "label": "Entradas 1",
                "wide": false
            },
            {
                "name": "entradas_2",
                "label": "Entradas 2",
                "wide": false
            },
            {
                "name": "entradas_3",
                "label": "Entradas 3",
                "wide": false
            },
            {
                "name": "especie_1",
                "label": "Especie 1",
                "wide": false
            },
            {
                "name": "especie_2",
                "label": "Especie 2",
                "wide": false
            },
            {
                "name": "especie_3",
                "label": "Especie 3",
                "wide": false
            },
            {
                "name": "estado_civil_produtor",
                "label": "Estado Civil Produtor",
                "wide": false
            },
            {
                "name": "forma_identificacao",
                "label": "Forma Identificacao",
                "wide": false
            },
            {
                "name": "municipio_propriedade",
                "label": "Municipio Propriedade",
                "wide": false
            },
            {
                "name": "nacionalidade_produtor",
                "label": "Nacionalidade Produtor",
                "wide": false
            },
            {
                "name": "nome_produtor",
                "label": "Nome Produtor",
                "wide": false
            },
            {
                "name": "nome_propriedade",
                "label": "Nome Propriedade",
                "wide": false
            },
            {
                "name": "quantidade_final_1",
                "label": "Quantidade Final 1",
                "wide": false
            },
            {
                "name": "quantidade_final_2",
                "label": "Quantidade Final 2",
                "wide": false
            },
            {
                "name": "quantidade_final_3",
                "label": "Quantidade Final 3",
                "wide": false
            },
            {
                "name": "quantidade_inicial_1",
                "label": "Quantidade Inicial 1",
                "wide": false
            },
            {
                "name": "quantidade_inicial_2",
                "label": "Quantidade Inicial 2",
                "wide": false
            },
            {
                "name": "quantidade_inicial_3",
                "label": "Quantidade Inicial 3",
                "wide": false
            },
            {
                "name": "registro_propriedade",
                "label": "Registro Propriedade",
                "wide": false
            },
            {
                "name": "rg_produtor",
                "label": "RG Produtor",
                "wide": false
            },
            {
                "name": "saidas_1",
                "label": "Saidas 1",
                "wide": false
            },
            {
                "name": "saidas_2",
                "label": "Saidas 2",
                "wide": false
            },
            {
                "name": "saidas_3",
                "label": "Saidas 3",
                "wide": false
            },
            {
                "name": "total_compras",
                "label": "Total Compras",
                "wide": false
            },
            {
                "name": "total_mortes",
                "label": "Total Mortes",
                "wide": false
            },
            {
                "name": "total_nascimentos",
                "label": "Total Nascimentos",
                "wide": false
            },
            {
                "name": "total_transferencias",
                "label": "Total Transferencias",
                "wide": false
            },
            {
                "name": "total_vendas",
                "label": "Total Vendas",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_propriedade",
                "label": "UF Propriedade",
                "wide": false
            },
            {
                "name": "vacinacao_rebanho",
                "label": "Vacinacao Rebanho",
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
                "name": "ano_safra",
                "label": "Ano Safra",
                "wide": false
            },
            {
                "name": "area_imovel",
                "label": "Area Imovel",
                "wide": false
            },
            {
                "name": "area_produto_1",
                "label": "Area Produto 1",
                "wide": false
            },
            {
                "name": "area_produto_2",
                "label": "Area Produto 2",
                "wide": false
            },
            {
                "name": "area_produto_3",
                "label": "Area Produto 3",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_produtor",
                "label": "CPF Produtor",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim_periodo",
                "label": "Data Fim Periodo",
                "wide": false
            },
            {
                "name": "data_inicio_periodo",
                "label": "Data Inicio Periodo",
                "wide": false
            },
            {
                "name": "destino_producao",
                "label": "Destino Producao",
                "wide": false
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco Imovel Rural",
                "wide": true
            },
            {
                "name": "endereco_produtor",
                "label": "Endereco Produtor",
                "wide": true
            },
            {
                "name": "estado_civil_produtor",
                "label": "Estado Civil Produtor",
                "wide": false
            },
            {
                "name": "local_armazenamento",
                "label": "Local Armazenamento",
                "wide": false
            },
            {
                "name": "municipio_imovel",
                "label": "Municipio Imovel",
                "wide": false
            },
            {
                "name": "nacionalidade_produtor",
                "label": "Nacionalidade Produtor",
                "wide": false
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome Imovel Rural",
                "wide": false
            },
            {
                "name": "nome_produtor",
                "label": "Nome Produtor",
                "wide": false
            },
            {
                "name": "produto_1",
                "label": "Produto 1",
                "wide": false
            },
            {
                "name": "produto_2",
                "label": "Produto 2",
                "wide": false
            },
            {
                "name": "produto_3",
                "label": "Produto 3",
                "wide": false
            },
            {
                "name": "quantidade_produto_1",
                "label": "Quantidade Produto 1",
                "wide": false
            },
            {
                "name": "quantidade_produto_2",
                "label": "Quantidade Produto 2",
                "wide": false
            },
            {
                "name": "quantidade_produto_3",
                "label": "Quantidade Produto 3",
                "wide": false
            },
            {
                "name": "registro_rural",
                "label": "Registro Rural",
                "wide": false
            },
            {
                "name": "rg_produtor",
                "label": "RG Produtor",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_imovel",
                "label": "UF Imovel",
                "wide": false
            },
            {
                "name": "unidade_produto_1",
                "label": "Unidade Produto 1",
                "wide": false
            },
            {
                "name": "unidade_produto_2",
                "label": "Unidade Produto 2",
                "wide": false
            },
            {
                "name": "unidade_produto_3",
                "label": "Unidade Produto 3",
                "wide": false
            },
            {
                "name": "valor_produto_1",
                "label": "Valor Produto 1",
                "wide": false
            },
            {
                "name": "valor_produto_2",
                "label": "Valor Produto 2",
                "wide": false
            },
            {
                "name": "valor_produto_3",
                "label": "Valor Produto 3",
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
                "name": "area_total_ha",
                "label": "Area Total Ha",
                "wide": false
            },
            {
                "name": "car_imovel",
                "label": "CAR Imovel",
                "wide": false
            },
            {
                "name": "ccir_incra",
                "label": "CCIR INCRA",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "confrontacoes_imovel",
                "label": "Confrontacoes Imovel",
                "wide": true
            },
            {
                "name": "cpf_cnpj_arrendador",
                "label": "CPF CNPJ Arrendador",
                "wide": true
            },
            {
                "name": "cpf_cnpj_arrendatario",
                "label": "CPF CNPJ Arrendatario",
                "wide": true
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim",
                "label": "Data Fim",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início na propriedade",
                "wide": false
            },
            {
                "name": "denominacao_imovel",
                "label": "Denominacao Imovel",
                "wide": false
            },
            {
                "name": "dia_vencimento",
                "label": "Dia Vencimento",
                "wide": false
            },
            {
                "name": "endereco_arrendador",
                "label": "Endereco Arrendador",
                "wide": true
            },
            {
                "name": "endereco_arrendatario",
                "label": "Endereco Arrendatario",
                "wide": true
            },
            {
                "name": "estado_civil_arrendador",
                "label": "Estado Civil Arrendador",
                "wide": true
            },
            {
                "name": "estado_civil_arrendatario",
                "label": "Estado Civil Arrendatario",
                "wide": true
            },
            {
                "name": "finalidade_arrendamento",
                "label": "Finalidade Arrendamento",
                "wide": true
            },
            {
                "name": "forma_pagamento",
                "label": "Forma Pagamento",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro Comarca",
                "wide": false
            },
            {
                "name": "foro_uf",
                "label": "Foro UF",
                "wide": false
            },
            {
                "name": "indice_reajuste",
                "label": "Indice Reajuste",
                "wide": false
            },
            {
                "name": "localizacao_imovel",
                "label": "Localizacao Imovel",
                "wide": true
            },
            {
                "name": "matricula_imovel",
                "label": "Matricula Imovel",
                "wide": false
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "nacionalidade_arrendador",
                "label": "Nacionalidade Arrendador",
                "wide": true
            },
            {
                "name": "nacionalidade_arrendatario",
                "label": "Nacionalidade Arrendatario",
                "wide": true
            },
            {
                "name": "nome_arrendador",
                "label": "Nome Arrendador",
                "wide": true
            },
            {
                "name": "nome_arrendatario",
                "label": "Nome Arrendatario",
                "wide": true
            },
            {
                "name": "numero_vias",
                "label": "Numero Vias",
                "wide": false
            },
            {
                "name": "periodicidade_pagamento",
                "label": "Periodicidade Pagamento",
                "wide": false
            },
            {
                "name": "prazo_arrendamento",
                "label": "Prazo Arrendamento",
                "wide": true
            },
            {
                "name": "prazo_aviso_rescisao",
                "label": "Prazo Aviso Rescisao",
                "wide": false
            },
            {
                "name": "prazo_inadimplencia",
                "label": "Prazo Inadimplencia",
                "wide": false
            },
            {
                "name": "profissao_arrendador",
                "label": "Profissao Arrendador",
                "wide": true
            },
            {
                "name": "profissao_arrendatario",
                "label": "Profissao Arrendatario",
                "wide": true
            },
            {
                "name": "rg_arrendador",
                "label": "RG Arrendador",
                "wide": true
            },
            {
                "name": "rg_arrendatario",
                "label": "RG Arrendatario",
                "wide": true
            },
            {
                "name": "uf",
                "label": "UF",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "valor_arrendamento",
                "label": "Valor Arrendamento",
                "wide": true
            },
            {
                "name": "valor_arrendamento_extenso",
                "label": "Valor Arrendamento Extenso",
                "wide": true
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
                "name": "acessorios_1",
                "label": "Acessorios 1",
                "wide": false
            },
            {
                "name": "acessorios_2",
                "label": "Acessorios 2",
                "wide": false
            },
            {
                "name": "acessorios_3",
                "label": "Acessorios 3",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_cnpj_comodante",
                "label": "CPF CNPJ Comodante",
                "wide": false
            },
            {
                "name": "cpf_cnpj_comodatario",
                "label": "CPF CNPJ Comodatario",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim",
                "label": "Data Fim",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início na propriedade",
                "wide": false
            },
            {
                "name": "endereco_comodante",
                "label": "Endereco Comodante",
                "wide": true
            },
            {
                "name": "endereco_comodatario",
                "label": "Endereco Comodatario",
                "wide": true
            },
            {
                "name": "equipamento_1",
                "label": "Equipamento 1",
                "wide": false
            },
            {
                "name": "equipamento_2",
                "label": "Equipamento 2",
                "wide": false
            },
            {
                "name": "equipamento_3",
                "label": "Equipamento 3",
                "wide": false
            },
            {
                "name": "estado_civil_comodante",
                "label": "Estado Civil Comodante",
                "wide": false
            },
            {
                "name": "estado_civil_comodatario",
                "label": "Estado Civil Comodatario",
                "wide": false
            },
            {
                "name": "estado_conservacao_1",
                "label": "Estado Conservacao 1",
                "wide": false
            },
            {
                "name": "estado_conservacao_2",
                "label": "Estado Conservacao 2",
                "wide": false
            },
            {
                "name": "estado_conservacao_3",
                "label": "Estado Conservacao 3",
                "wide": false
            },
            {
                "name": "finalidade_uso_equipamento",
                "label": "Finalidade Uso Equipamento",
                "wide": true
            },
            {
                "name": "foro_comarca",
                "label": "Foro Comarca",
                "wide": false
            },
            {
                "name": "foro_uf",
                "label": "Foro UF",
                "wide": false
            },
            {
                "name": "marca_modelo_1",
                "label": "Marca Modelo 1",
                "wide": false
            },
            {
                "name": "marca_modelo_2",
                "label": "Marca Modelo 2",
                "wide": false
            },
            {
                "name": "marca_modelo_3",
                "label": "Marca Modelo 3",
                "wide": false
            },
            {
                "name": "nacionalidade_comodante",
                "label": "Nacionalidade Comodante",
                "wide": false
            },
            {
                "name": "nacionalidade_comodatario",
                "label": "Nacionalidade Comodatario",
                "wide": false
            },
            {
                "name": "nome_comodante",
                "label": "Nome Comodante",
                "wide": false
            },
            {
                "name": "nome_comodatario",
                "label": "Nome Comodatario",
                "wide": false
            },
            {
                "name": "numero_vias",
                "label": "Numero Vias",
                "wide": false
            },
            {
                "name": "prazo_comodato",
                "label": "Prazo Comodato",
                "wide": false
            },
            {
                "name": "profissao_comodante",
                "label": "Profissao Comodante",
                "wide": false
            },
            {
                "name": "profissao_comodatario",
                "label": "Profissao Comodatario",
                "wide": false
            },
            {
                "name": "regra_manutencao_extraordinaria",
                "label": "Regra Manutencao Extraordinaria",
                "wide": false
            },
            {
                "name": "responsavel_despesas",
                "label": "Responsavel Despesas",
                "wide": false
            },
            {
                "name": "rg_comodante",
                "label": "RG Comodante",
                "wide": false
            },
            {
                "name": "rg_comodatario",
                "label": "RG Comodatario",
                "wide": false
            },
            {
                "name": "serie_chassi_1",
                "label": "Serie Chassi 1",
                "wide": false
            },
            {
                "name": "serie_chassi_2",
                "label": "Serie Chassi 2",
                "wide": false
            },
            {
                "name": "serie_chassi_3",
                "label": "Serie Chassi 3",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "area_parceria_ha",
                "label": "Area Parceria Ha",
                "wide": false
            },
            {
                "name": "atividade_parceria",
                "label": "Atividade Parceria",
                "wide": true
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_cnpj_outorgado",
                "label": "CPF CNPJ Outorgado",
                "wide": false
            },
            {
                "name": "cpf_cnpj_outorgante",
                "label": "CPF CNPJ Outorgante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim",
                "label": "Data Fim",
                "wide": false
            },
            {
                "name": "data_inicio",
                "label": "Data de início na propriedade",
                "wide": false
            },
            {
                "name": "denominacao_area",
                "label": "Denominacao Area",
                "wide": false
            },
            {
                "name": "descricao_atividade",
                "label": "Descricao Atividade",
                "wide": true
            },
            {
                "name": "divisao_despesas",
                "label": "Divisao Despesas",
                "wide": false
            },
            {
                "name": "endereco_outorgado",
                "label": "Endereco Outorgado",
                "wide": true
            },
            {
                "name": "endereco_outorgante",
                "label": "Endereco Outorgante",
                "wide": true
            },
            {
                "name": "estado_civil_outorgado",
                "label": "Estado Civil Outorgado",
                "wide": false
            },
            {
                "name": "estado_civil_outorgante",
                "label": "Estado Civil Outorgante",
                "wide": false
            },
            {
                "name": "foro_comarca",
                "label": "Foro Comarca",
                "wide": false
            },
            {
                "name": "foro_uf",
                "label": "Foro UF",
                "wide": false
            },
            {
                "name": "localizacao_area",
                "label": "Localizacao Area",
                "wide": true
            },
            {
                "name": "matricula_area",
                "label": "Matricula Area",
                "wide": false
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "nacionalidade_outorgado",
                "label": "Nacionalidade Outorgado",
                "wide": false
            },
            {
                "name": "nacionalidade_outorgante",
                "label": "Nacionalidade Outorgante",
                "wide": false
            },
            {
                "name": "nome_outorgado",
                "label": "Nome Outorgado",
                "wide": false
            },
            {
                "name": "nome_outorgante",
                "label": "Nome Outorgante",
                "wide": false
            },
            {
                "name": "numero_vias",
                "label": "Numero Vias",
                "wide": false
            },
            {
                "name": "percentual_outorgado",
                "label": "Percentual Outorgado",
                "wide": false
            },
            {
                "name": "percentual_outorgante",
                "label": "Percentual Outorgante",
                "wide": false
            },
            {
                "name": "periodicidade_apuracao",
                "label": "Periodicidade Apuracao",
                "wide": false
            },
            {
                "name": "periodicidade_prestacao_contas",
                "label": "Periodicidade Prestacao Contas",
                "wide": false
            },
            {
                "name": "prazo_aviso_rescisao",
                "label": "Prazo Aviso Rescisao",
                "wide": false
            },
            {
                "name": "prazo_parceria",
                "label": "Prazo Parceria",
                "wide": false
            },
            {
                "name": "profissao_outorgado",
                "label": "Profissao Outorgado",
                "wide": false
            },
            {
                "name": "profissao_outorgante",
                "label": "Profissao Outorgante",
                "wide": false
            },
            {
                "name": "rg_outorgado",
                "label": "RG Outorgado",
                "wide": false
            },
            {
                "name": "rg_outorgante",
                "label": "RG Outorgante",
                "wide": false
            },
            {
                "name": "uf",
                "label": "UF",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "area_aproximada",
                "label": "Area Aproximada",
                "wide": false
            },
            {
                "name": "benfeitorias_atividades",
                "label": "Benfeitorias Atividades",
                "wide": true
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "confrontante_leste",
                "label": "Confrontante Leste",
                "wide": true
            },
            {
                "name": "confrontante_norte",
                "label": "Confrontante Norte",
                "wide": true
            },
            {
                "name": "confrontante_oeste",
                "label": "Confrontante Oeste",
                "wide": true
            },
            {
                "name": "confrontante_sul",
                "label": "Confrontante Sul",
                "wide": true
            },
            {
                "name": "coordenadas_referencia",
                "label": "Coordenadas Referencia",
                "wide": false
            },
            {
                "name": "cpf_cnpj_declarante",
                "label": "CPF CNPJ Declarante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_inicio_posse",
                "label": "Data Inicio Posse",
                "wide": false
            },
            {
                "name": "denominacao_imovel",
                "label": "Denominacao Imovel",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "finalidade_uso",
                "label": "Finalidade Uso",
                "wide": true
            },
            {
                "name": "localizacao_imovel",
                "label": "Localizacao Imovel",
                "wide": true
            },
            {
                "name": "municipio",
                "label": "Municipio",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf",
                "label": "UF",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "bairro_residencia",
                "label": "Bairro Residencia",
                "wide": false
            },
            {
                "name": "cep_residencia",
                "label": "CEP Residencia",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cidade_residencia",
                "label": "Cidade Residencia",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "cpf_titular_comprovante",
                "label": "CPF Titular Comprovante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_inicio_residencia",
                "label": "Data Inicio Residencia",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "endereco_residencia",
                "label": "Endereco Residencia",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_titular_comprovante",
                "label": "Nome Titular Comprovante",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_residencia",
                "label": "UF Residencia",
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
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "cpf_responsavel_ajuda",
                "label": "CPF Responsavel Ajuda",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "forma_manutencao",
                "label": "Forma Manutencao",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_responsavel_ajuda",
                "label": "Nome Responsavel Ajuda",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "valor_ajuda_eventual",
                "label": "Valor Ajuda Eventual",
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
                "name": "area_explorada",
                "label": "Area Explorada",
                "wide": false
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_inicio_agricultura_familiar",
                "label": "Data Inicio Agricultura Familiar",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco Imovel Rural",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "fonte_renda_agricultura_familiar",
                "label": "Fonte Renda Agricultura Familiar",
                "wide": true
            },
            {
                "name": "membros_familiares_atividade",
                "label": "Membros Familiares Atividade",
                "wide": true
            },
            {
                "name": "municipio_imovel_rural",
                "label": "Municipio Imovel Rural",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome Imovel Rural",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "produtos_agricultura_familiar",
                "label": "Produtos Agricultura Familiar",
                "wide": true
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_imovel_rural",
                "label": "UF Imovel Rural",
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
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "cpf_dependente",
                "label": "CPF Dependente",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_inicio_dependencia",
                "label": "Data Inicio Dependencia",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "motivo_dependencia",
                "label": "Motivo Dependencia",
                "wide": true
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_dependente",
                "label": "Nome Dependente",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "parentesco_dependente",
                "label": "Parentesco Dependente",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "renda_dependente",
                "label": "Renda Dependente",
                "wide": true
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "cpf_familiar_convivente",
                "label": "CPF Familiar Convivente",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_inicio_convivencia",
                "label": "Data Inicio Convivencia",
                "wide": false
            },
            {
                "name": "endereco_convivencia_familiar",
                "label": "Endereco Convivencia Familiar",
                "wide": true
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "finalidade_declaracao",
                "label": "Finalidade Declaracao",
                "wide": true
            },
            {
                "name": "grau_parentesco_convivente",
                "label": "Grau Parentesco Convivente",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_familiar_convivente",
                "label": "Nome Familiar Convivente",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nomes_membros_familiares",
                "label": "Nomes Membros Familiares",
                "wide": true
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "quantidade_membros_familiares",
                "label": "Quantidade Membros Familiares",
                "wide": true
            },
            {
                "name": "renda_familiar_mensal",
                "label": "Renda Familiar Mensal",
                "wide": true
            },
            {
                "name": "renda_mensal_individual",
                "label": "Renda Mensal Individual",
                "wide": true
            },
            {
                "name": "renda_per_capita",
                "label": "Renda Per Capita",
                "wide": true
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "lista_documentos_autenticados",
                "label": "Lista Documentos Autenticados",
                "wide": true
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim_atividade_rural",
                "label": "Data Fim Atividade Rural",
                "wide": true
            },
            {
                "name": "data_inicio_atividade_rural",
                "label": "Data Inicio Atividade Rural",
                "wide": true
            },
            {
                "name": "descricao_atividade_rural",
                "label": "Descricao Atividade Rural",
                "wide": true
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "endereco_imovel_rural",
                "label": "Endereco Imovel Rural",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "forma_exercicio_atividade",
                "label": "Forma Exercicio Atividade",
                "wide": true
            },
            {
                "name": "funcao_rural",
                "label": "Funcao Rural",
                "wide": false
            },
            {
                "name": "municipio_imovel_rural",
                "label": "Municipio Imovel Rural",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_imovel_rural",
                "label": "Nome Imovel Rural",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "renda_media_rural",
                "label": "Renda Media Rural",
                "wide": true
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_imovel_rural",
                "label": "UF Imovel Rural",
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
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "cpf_convivente_1",
                "label": "CPF Convivente 1",
                "wide": false
            },
            {
                "name": "cpf_convivente_2",
                "label": "CPF Convivente 2",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_inicio_uniao_estavel",
                "label": "Data Inicio Uniao Estavel",
                "wide": false
            },
            {
                "name": "endereco_convivente_1",
                "label": "Endereco Convivente 1",
                "wide": true
            },
            {
                "name": "endereco_convivente_2",
                "label": "Endereco Convivente 2",
                "wide": true
            },
            {
                "name": "endereco_residencia_casal",
                "label": "Endereco Residencia Casal",
                "wide": true
            },
            {
                "name": "estado_civil_convivente_1",
                "label": "Estado Civil Convivente 1",
                "wide": false
            },
            {
                "name": "estado_civil_convivente_2",
                "label": "Estado Civil Convivente 2",
                "wide": false
            },
            {
                "name": "nacionalidade_convivente_1",
                "label": "Nacionalidade Convivente 1",
                "wide": false
            },
            {
                "name": "nacionalidade_convivente_2",
                "label": "Nacionalidade Convivente 2",
                "wide": false
            },
            {
                "name": "nome_convivente_1",
                "label": "Nome Convivente 1",
                "wide": false
            },
            {
                "name": "nome_convivente_2",
                "label": "Nome Convivente 2",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_convivente_1",
                "label": "Profissao Convivente 1",
                "wide": false
            },
            {
                "name": "profissao_convivente_2",
                "label": "Profissao Convivente 2",
                "wide": false
            },
            {
                "name": "regime_bens_uniao",
                "label": "Regime Bens Uniao",
                "wide": false
            },
            {
                "name": "rg_convivente_1",
                "label": "RG Convivente 1",
                "wide": false
            },
            {
                "name": "rg_convivente_2",
                "label": "RG Convivente 2",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
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
                "name": "atividades_desempenhadas",
                "label": "Atividades Desempenhadas",
                "wide": true
            },
            {
                "name": "cidade_assinatura",
                "label": "Cidade Assinatura",
                "wide": false
            },
            {
                "name": "condicao_trabalho_rural",
                "label": "Condicao Trabalho Rural",
                "wide": false
            },
            {
                "name": "cpf_declarante",
                "label": "CPF Declarante",
                "wide": false
            },
            {
                "name": "cpf_responsavel_propriedade",
                "label": "CPF Responsavel Propriedade",
                "wide": false
            },
            {
                "name": "data_assinatura_extenso",
                "label": "Data Assinatura Extenso",
                "wide": false
            },
            {
                "name": "data_fim_trabalho_rural",
                "label": "Data Fim Trabalho Rural",
                "wide": false
            },
            {
                "name": "data_inicio_trabalho_rural",
                "label": "Data Inicio Trabalho Rural",
                "wide": false
            },
            {
                "name": "endereco_declarante",
                "label": "Endereco Declarante",
                "wide": true
            },
            {
                "name": "endereco_propriedade_rural",
                "label": "Endereco Propriedade Rural",
                "wide": true
            },
            {
                "name": "estado_civil_declarante",
                "label": "Estado Civil Declarante",
                "wide": false
            },
            {
                "name": "frequencia_trabalho_rural",
                "label": "Frequencia Trabalho Rural",
                "wide": false
            },
            {
                "name": "municipio_propriedade_rural",
                "label": "Municipio Propriedade Rural",
                "wide": false
            },
            {
                "name": "nacionalidade_declarante",
                "label": "Nacionalidade Declarante",
                "wide": false
            },
            {
                "name": "nome_declarante",
                "label": "Nome Declarante",
                "wide": false
            },
            {
                "name": "nome_propriedade_rural",
                "label": "Nome Propriedade Rural",
                "wide": false
            },
            {
                "name": "nome_responsavel_propriedade",
                "label": "Nome Responsavel Propriedade",
                "wide": false
            },
            {
                "name": "orgao_destino",
                "label": "Orgao Destino",
                "wide": false
            },
            {
                "name": "profissao_declarante",
                "label": "Profissao Declarante",
                "wide": false
            },
            {
                "name": "rg_declarante",
                "label": "RG Declarante",
                "wide": false
            },
            {
                "name": "uf_assinatura",
                "label": "UF Assinatura",
                "wide": false
            },
            {
                "name": "uf_propriedade_rural",
                "label": "UF Propriedade Rural",
                "wide": false
            }
        ]
    }
];

    /* v121: campos limpos extraídos diretamente dos modelos DOCX.
       Isso remove campos duplicados/inventados e garante que Word/PDF usem as mesmas chaves do template. */
    const DOCSPACE_TEMPLATE_FIELDS = {"comodato":[{"name":"nome_comandante","label":"Nome completo do comodante","wide":false},{"name":"estado_civil_comandante","label":"Estado civil do comodante","wide":false},{"name":"profissao_comandante","label":"Profissão do comodante","wide":false},{"name":"rg_comandante","label":"RG do comodante","wide":false},{"name":"cpf_comandante","label":"CPF/CNPJ do comodante","wide":false},{"name":"localidade_comandante","label":"Localidade do comodante","wide":true},{"name":"nome_comandatario","label":"Nome completo do comodatário","wide":false},{"name":"estado_civil_comandatario","label":"Estado civil do comodatário","wide":false},{"name":"profissão_comandatario","label":"Profissão do comodatário","wide":false},{"name":"rg_comandatario","label":"RG do comodatário","wide":false},{"name":"cpf_comandatario","label":"CPF/CNPJ do comodatário","wide":false},{"name":"localidade_comandatario","label":"Localidade do comodatário","wide":true},{"name":"localidade_proxima_comandatario","label":"Comunidade/localidade próxima","wide":true},{"name":"município_comandatrio","label":"Município do comodatário","wide":false},{"name":"nome_imovel","label":"Nome do imóvel rural","wide":false},{"name":"localidade_imovel_rural","label":"Localidade do imóvel rural","wide":true},{"name":"nirf_terra","label":"NIRF do imóvel","wide":false},{"name":"tamanho_trerra_numeros","label":"Área do imóvel em números","wide":false},{"name":"tamanho_terra_letras","label":"Área do imóvel por extenso","wide":false},{"name":"oque_produz","label":"O que produz","wide":false},{"name":"tamanho_utilizado_numeros","label":"Área utilizada em números","wide":false},{"name":"tamanho_utilizado_letras","label":"Área utilizada por extenso","wide":false},{"name":"duração_contrato","label":"Duração do contrato","wide":false},{"name":"data_inicio","label":"Data de início","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mes","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false},{"name":"profissao_comandatario","label":"Profissão do comodatário","wide":false},{"name":"municipio_comandatario","label":"Municipio comandatario","wide":false},{"name":"nome_conjuge","label":"Nome conjuge","wide":false},{"name":"nacionalidade_conjuge","label":"Nacionalidade conjuge","wide":false},{"name":"estado_civil_conjuge","label":"Estado civil conjuge","wide":false},{"name":"profissao_conjuge","label":"Profissao conjuge","wide":false},{"name":"rg_conjuge","label":"RG conjuge","wide":false},{"name":"cpf_conjuge","label":"CPF conjuge","wide":false},{"name":"localidade_conjuge","label":"Localidade conjuge","wide":true},{"name":"localidade_proxima_conjuge","label":"Localidade proxima conjuge","wide":true},{"name":"municipio_conjuge","label":"Municipio conjuge","wide":false},{"name":"nome_comandante_falecido","label":"Nome comandante falecido","wide":false},{"name":"estado_civil_comandante_falecido","label":"Estado civil comandante falecido","wide":false},{"name":"profissao_comandante_falecido","label":"Profissao comandante falecido","wide":false},{"name":"rg_comandante_falecido","label":"RG comandante falecido","wide":false},{"name":"cpf_comandante_falecido","label":"CPF comandante falecido","wide":false},{"name":"localidade_comandante_falecido","label":"Localidade comandante falecido","wide":true},{"name":"numero_obito","label":"Numero obito","wide":false},{"name":"data_falecimento","label":"Data falecimento","wide":false},{"name":"representante_do_falecido","label":"Representante do falecido","wide":false},{"name":"parentesco_representante","label":"Parentesco representante","wide":false},{"name":"rg_representante","label":"RG representante","wide":false},{"name":"cpf_representante","label":"CPF representante","wide":false},{"name":"endereço_representante","label":"Endereço representante","wide":true}],"ufba-membros":[{"name":"nome_representante","label":"Nome representante","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"endereço","label":"Endereço","wide":true},{"name":"localidade","label":"Localidade","wide":true},{"name":"produto1","label":"Produto1","wide":true},{"name":"valor1","label":"Valor1","wide":false},{"name":"produto2","label":"Produto2","wide":true},{"name":"valor2","label":"Valor2","wide":false},{"name":"produto3","label":"Produto3","wide":true},{"name":"valor3","label":"Valor3","wide":false},{"name":"valor_total_numeros","label":"Valor total numeros","wide":false},{"name":"valor_total_escrito","label":"Valor total escrito","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mês","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"renda-membros":[{"name":"nome_representante","label":"Nome representante","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"endereço","label":"Endereço","wide":true},{"name":"localidade","label":"Localidade","wide":true},{"name":"tipo_renda","label":"Tipo renda","wide":false},{"name":"nome_mebro","label":"Nome mebro","wide":false},{"name":"valor_anual","label":"Valor anual","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mês","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"posse":[{"name":"nome_posseiro","label":"Nome posseiro","wide":false},{"name":"estado_civil","label":"Estado civil","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"endereço","label":"Endereço","wide":true},{"name":"período_numero","label":"Período numero","wide":false},{"name":"período_extenso","label":"Período extenso","wide":false},{"name":"nome_imovel","label":"Nome do imóvel rural","wide":false},{"name":"área_total_imovel","label":"Área total imovel","wide":false},{"name":"ao_norte","label":"Ao norte","wide":false},{"name":"cpf_norte","label":"CPF norte","wide":false},{"name":"ao_leste","label":"Ao leste","wide":false},{"name":"cpf_leste","label":"CPF leste","wide":false},{"name":"ao_oeste","label":"Ao oeste","wide":false},{"name":"cpf_oeste","label":"CPF oeste","wide":false},{"name":"ao_sul","label":"Ao sul","wide":false},{"name":"cpf_sul","label":"CPF sul","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mês","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"autodeclaracao-rural":[{"name":"nome_segurado","label":"Nome segurado","wide":false},{"name":"escolaridade_segurado","label":"Escolaridade segurado","wide":false},{"name":"telefone1_segurado","label":"Telefone1 segurado","wide":false},{"name":"cor_raca_segurado","label":"Cor raca segurado","wide":false},{"name":"telefone2_segurado","label":"Telefone2 segurado","wide":false},{"name":"estado_civil_segurado","label":"Estado civil segurado","wide":false},{"name":"endereco_segurado","label":"Endereco segurado","wide":true},{"name":"cpf_segurado","label":"CPF segurado","wide":false},{"name":"beneficio","label":"Beneficio","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mes","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false},{"name":"apelido_segurado","label":"Apelido segurado","wide":false},{"name":"data_nascimento","label":"Data nascimento","wide":false},{"name":"local_nascimento","label":"Local nascimento","wide":false},{"name":"cidade","label":"Cidade","wide":false},{"name":"uf","label":"UF","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"local_expedicao","label":"Local expedicao","wide":false},{"name":"data_emissao","label":"Data emissao","wide":false},{"name":"periodo_inicial_1","label":"Periodo inicial 1","wide":false},{"name":"periodo_final_1","label":"Periodo final 1","wide":false},{"name":"condicao_1","label":"Condicao 1","wide":false},{"name":"situacao_individual_1","label":"Situacao individual 1","wide":false},{"name":"situacao_regime_1","label":"Situacao regime 1","wide":false},{"name":"periodo_inicial_2","label":"Periodo inicial 2","wide":false},{"name":"periodo_final_2","label":"Periodo final 2","wide":false},{"name":"condicao_2","label":"Condicao 2","wide":false},{"name":"situacao_individual_2","label":"Situacao individual 2","wide":false},{"name":"situacao_regime_2","label":"Situacao regime 2","wide":false},{"name":"periodo_inicial_3","label":"Periodo inicial 3","wide":false},{"name":"periodo_final_3","label":"Periodo final 3","wide":false},{"name":"condicao_3","label":"Condicao 3","wide":false},{"name":"situacao_individual_3","label":"Situacao individual 3","wide":false},{"name":"situacao_regime_3","label":"Situacao regime 3","wide":false},{"name":"titular","label":"Titular","wide":false},{"name":"componente","label":"Componente","wide":false},{"name":"nome_familiar_1","label":"Nome familiar 1","wide":false},{"name":"dn_familiar_1","label":"Dn familiar 1","wide":false},{"name":"cpf_familiar_1","label":"CPF familiar 1","wide":false},{"name":"estado_civil_familiar_1","label":"Estado civil familiar 1","wide":false},{"name":"parentesco_familiar_1","label":"Parentesco familiar 1","wide":false},{"name":"nome_familiar_2","label":"Nome familiar 2","wide":false},{"name":"dn_familiar_2","label":"Dn familiar 2","wide":false},{"name":"cpf_familiar_2","label":"CPF familiar 2","wide":false},{"name":"estado_civil_familiar_2","label":"Estado civil familiar 2","wide":false},{"name":"parentesco_familiar_2","label":"Parentesco familiar 2","wide":false},{"name":"nome_familiar_3","label":"Nome familiar 3","wide":false},{"name":"dn_familiar_3","label":"Dn familiar 3","wide":false},{"name":"cpf_familiar_3","label":"CPF familiar 3","wide":false},{"name":"estado_civil_familiar_3","label":"Estado civil familiar 3","wide":false},{"name":"parentesco_familiar_3","label":"Parentesco familiar 3","wide":false},{"name":"nome_familiar_4","label":"Nome familiar 4","wide":false},{"name":"dn_familiar_4","label":"Dn familiar 4","wide":false},{"name":"cpf_familiar_4","label":"CPF familiar 4","wide":false},{"name":"estado_civil_familiar_4","label":"Estado civil familiar 4","wide":false},{"name":"parentesco_familiar_4","label":"Parentesco familiar 4","wide":false},{"name":"itr_terra_1","label":"Itr terra 1","wide":false},{"name":"nome_propiedade_1","label":"Nome propiedade 1","wide":false},{"name":"municipio_uf_1","label":"Municipio UF 1","wide":false},{"name":"area_total_1","label":"Area total 1","wide":false},{"name":"area_explorada_1","label":"Area explorada 1","wide":false},{"name":"nome_proprietario_1","label":"Nome proprietario 1","wide":false},{"name":"cpf_proprietario_1","label":"CPF proprietario 1","wide":false},{"name":"itr_terra_2","label":"Itr terra 2","wide":false},{"name":"nome_propiedade_2","label":"Nome propiedade 2","wide":false},{"name":"municipio_uf_2","label":"Municipio UF 2","wide":false},{"name":"area_total_2","label":"Area total 2","wide":false},{"name":"area_explorada_2","label":"Area explorada 2","wide":false},{"name":"nome_proprietario_2","label":"Nome proprietario 2","wide":false},{"name":"cpf_proprietario_2","label":"CPF proprietario 2","wide":false},{"name":"itr_terra_3","label":"Itr terra 3","wide":false},{"name":"nome_propiedade_3","label":"Nome propiedade 3","wide":false},{"name":"municipio_uf_3","label":"Municipio UF 3","wide":false},{"name":"area_total_3","label":"Area total 3","wide":false},{"name":"area_explorada_3","label":"Area explorada 3","wide":false},{"name":"nome_proprietario_3","label":"Nome proprietario 3","wide":false},{"name":"cpf_proprietario_3","label":"CPF proprietario 3","wide":false},{"name":"itr_terra_4","label":"Itr terra 4","wide":false},{"name":"nome_propiedade_4","label":"Nome propiedade 4","wide":false},{"name":"municipio_uf_4","label":"Municipio UF 4","wide":false},{"name":"area_total_4","label":"Area total 4","wide":false},{"name":"area_explorada_4","label":"Area explorada 4","wide":false},{"name":"nome_proprietario_4","label":"Nome proprietario 4","wide":false},{"name":"cpf_proprietario_4","label":"CPF proprietario 4","wide":false},{"name":"atividade_rural_1","label":"Atividade rural 1","wide":true},{"name":"subsistencia_venda_1","label":"Subsistencia venda 1","wide":false},{"name":"atividade_rural_2","label":"Atividade rural 2","wide":true},{"name":"subsistencia_venda_2","label":"Subsistencia venda 2","wide":false},{"name":"atividade_rural_3","label":"Atividade rural 3","wide":true},{"name":"subsistencia_venda_3","label":"Subsistencia venda 3","wide":false},{"name":"sim_ipi","label":"Sim ipi","wide":false},{"name":"nao_ipi","label":"Nao ipi","wide":false},{"name":"ipi_periodo_1","label":"Ipi periodo 1","wide":false},{"name":"ipi_periodo_2","label":"Ipi periodo 2","wide":false},{"name":"sim_empregados","label":"Sim empregados","wide":false},{"name":"nao_empregados","label":"Nao empregados","wide":false},{"name":"empregado_nome_1","label":"Empregado nome 1","wide":false},{"name":"empregado_cpf_1","label":"Empregado CPF 1","wide":false},{"name":"empregado_periodo_1","label":"Empregado periodo 1","wide":false},{"name":"empregado_nome_2","label":"Empregado nome 2","wide":false},{"name":"empregado_cpf_2","label":"Empregado CPF 2","wide":false},{"name":"empregado_periodo_2","label":"Empregado periodo 2","wide":false},{"name":"empregado_nome_3","label":"Empregado nome 3","wide":false},{"name":"empregado_cpf_3","label":"Empregado CPF 3","wide":false},{"name":"empregado_periodo_3","label":"Empregado periodo 3","wide":false},{"name":"sim_outra_atividade","label":"Sim outra atividade","wide":true},{"name":"nao_outra_atividade","label":"Nao outra atividade","wide":true},{"name":"outra_atividade_renda_1","label":"Outra atividade renda 1","wide":true},{"name":"outra_atividade_local_1","label":"Outra atividade local 1","wide":true},{"name":"outra_atividade_periodo_1","label":"Outra atividade periodo 1","wide":true},{"name":"outra_atividade_renda_2","label":"Outra atividade renda 2","wide":true},{"name":"outra_atividade_local_2","label":"Outra atividade local 2","wide":true},{"name":"outra_atividade_periodo_2","label":"Outra atividade periodo 2","wide":true},{"name":"outra_atividade_renda_3","label":"Outra atividade renda 3","wide":true},{"name":"outra_atividade_local_3","label":"Outra atividade local 3","wide":true},{"name":"outra_atividade_periodo_3","label":"Outra atividade periodo 3","wide":true},{"name":"outra_atividade_renda_4","label":"Outra atividade renda 4","wide":true},{"name":"outra_atividade_local_4","label":"Outra atividade local 4","wide":true},{"name":"outra_atividade_periodo_4","label":"Outra atividade periodo 4","wide":true},{"name":"outra_atividade_renda_5","label":"Outra atividade renda 5","wide":true},{"name":"outra_atividade_local_5","label":"Outra atividade local 5","wide":true},{"name":"outra_atividade_periodo_5","label":"Outra atividade periodo 5","wide":true},{"name":"sim_outra_renda","label":"Sim outra renda","wide":false},{"name":"nao_outra_renda","label":"Nao outra renda","wide":false},{"name":"outra_renda_atividade_1","label":"Outra renda atividade 1","wide":true},{"name":"outra_renda_periodo_1","label":"Outra renda periodo 1","wide":false},{"name":"outra_renda_valor_1","label":"Outra renda valor 1","wide":false},{"name":"outra_renda_informacoes_1","label":"Outra renda informacoes 1","wide":false},{"name":"outra_renda_atividade_2","label":"Outra renda atividade 2","wide":true},{"name":"outra_renda_periodo_2","label":"Outra renda periodo 2","wide":false},{"name":"outra_renda_valor_2","label":"Outra renda valor 2","wide":false},{"name":"outra_renda_informacoes_2","label":"Outra renda informacoes 2","wide":false},{"name":"outra_renda_atividade_3","label":"Outra renda atividade 3","wide":true},{"name":"outra_renda_periodo_3","label":"Outra renda periodo 3","wide":false},{"name":"outra_renda_valor_3","label":"Outra renda valor 3","wide":false},{"name":"outra_renda_informacoes_3","label":"Outra renda informacoes 3","wide":false},{"name":"outra_renda_atividade_4","label":"Outra renda atividade 4","wide":true},{"name":"outra_renda_periodo_4","label":"Outra renda periodo 4","wide":false},{"name":"outra_renda_valor_4","label":"Outra renda valor 4","wide":false},{"name":"outra_renda_informacoes_4","label":"Outra renda informacoes 4","wide":false},{"name":"sim_cooperativa","label":"Sim cooperativa","wide":false},{"name":"nao_cooperativa","label":"Nao cooperativa","wide":false},{"name":"cooperativa_entidade","label":"Cooperativa entidade","wide":false},{"name":"cooperativa_cnpj","label":"Cooperativa CNPJ","wide":false},{"name":"cooperativa_tipo","label":"Cooperativa tipo","wide":false},{"name":"data","label":"Data","wide":false},{"name":"endereco","label":"Endereço","wide":true},{"name":"nome_beneficio","label":"Nome beneficio","wide":false}],"procuracao-consumidor":[{"name":"nome_pessoa","label":"Nome completo","wide":false},{"name":"profissao","label":"Profissão","wide":false},{"name":"estado_civil","label":"Estado civil","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"telefone","label":"Telefone","wide":false},{"name":"endereco","label":"Endereço","wide":true},{"name":"municipio","label":"Município","wide":false},{"name":"cidade","label":"Cidade","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mes","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"procuracao-normal":[{"name":"nome_pessoa","label":"Nome completo","wide":false},{"name":"profissao","label":"Profissão","wide":false},{"name":"estado_civil","label":"Estado civil","wide":false},{"name":"telefone","label":"Telefone","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"endereco","label":"Endereço","wide":true},{"name":"municipio","label":"Município","wide":false},{"name":"cidade","label":"Cidade","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mes","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"contrato-honorarios-50":[{"name":"nome_pessoa","label":"Nome completo","wide":false},{"name":"profissao","label":"Profissão","wide":false},{"name":"estado_civil","label":"Estado civil","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"telefone","label":"Telefone","wide":false},{"name":"endereco","label":"Endereço","wide":true},{"name":"municipio","label":"Município","wide":false},{"name":"cidade","label":"Cidade","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mes","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"contrato-prev-40":[{"name":"nome_pessoa","label":"Nome completo","wide":false},{"name":"profissao","label":"Profissão","wide":false},{"name":"estado_civil","label":"Estado civil","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"telefone","label":"Telefone","wide":false},{"name":"endereco","label":"Endereço","wide":true},{"name":"municipio","label":"Município","wide":false},{"name":"cidade","label":"Cidade","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mes","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"contrato-prev-30":[{"name":"nome_pessoa","label":"Nome completo","wide":false},{"name":"profissao","label":"Profissão","wide":false},{"name":"estado_civil","label":"Estado civil","wide":false},{"name":"rg","label":"RG","wide":false},{"name":"cpf","label":"CPF","wide":false},{"name":"endereco","label":"Endereço","wide":true},{"name":"municipio","label":"Município","wide":false},{"name":"cidade","label":"Cidade","wide":false},{"name":"dia","label":"Dia","wide":false},{"name":"mes","label":"Mês","wide":false},{"name":"ano","label":"Ano","wide":false}],"contrato-compra-venda-imovel":[{"name":"nome_vendedor","label":"Nome vendedor","wide":false},{"name":"nacionalidade_vendedor","label":"Nacionalidade vendedor","wide":false},{"name":"estado_civil_vendedor","label":"Estado civil vendedor","wide":false},{"name":"rg_vendedor","label":"RG vendedor","wide":false},{"name":"cpf_vendedor","label":"CPF vendedor","wide":false},{"name":"endereco_vendedor","label":"Endereco vendedor","wide":true},{"name":"nome_comprador","label":"Nome comprador","wide":false},{"name":"nacionalidade_comprador","label":"Nacionalidade comprador","wide":false},{"name":"estado_civil_comprador","label":"Estado civil comprador","wide":false},{"name":"rg_comprador","label":"RG comprador","wide":false},{"name":"cpf_comprador","label":"CPF comprador","wide":false},{"name":"endereco_comprador","label":"Endereco comprador","wide":true},{"name":"quantidade_bens","label":"Quantidade bens","wide":false},{"name":"denominacao_imovel","label":"Denominacao imovel","wide":false},{"name":"comprimento_imovel","label":"Comprimento imovel","wide":false},{"name":"largura_imovel","label":"LaRGura imovel","wide":false},{"name":"endereco_imovel","label":"Endereco imovel","wide":true},{"name":"valor_venda","label":"Valor venda","wide":false},{"name":"valor_venda_extenso","label":"Valor venda extenso","wide":false},{"name":"foro_comarca","label":"Foro comarca","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"contrato-compra-venda-veiculo":[{"name":"nome_vendedor","label":"Nome vendedor","wide":false},{"name":"nacionalidade_vendedor","label":"Nacionalidade vendedor","wide":false},{"name":"estado_civil_vendedor","label":"Estado civil vendedor","wide":false},{"name":"rg_vendedor","label":"RG vendedor","wide":false},{"name":"cpf_vendedor","label":"CPF vendedor","wide":false},{"name":"endereco_vendedor","label":"Endereco vendedor","wide":true},{"name":"nome_comprador","label":"Nome comprador","wide":false},{"name":"nacionalidade_comprador","label":"Nacionalidade comprador","wide":false},{"name":"estado_civil_comprador","label":"Estado civil comprador","wide":false},{"name":"rg_comprador","label":"RG comprador","wide":false},{"name":"cpf_comprador","label":"CPF comprador","wide":false},{"name":"endereco_comprador","label":"Endereco comprador","wide":true},{"name":"tipo_bem","label":"Tipo bem","wide":false},{"name":"marca_bem","label":"Marca bem","wide":false},{"name":"modelo_bem","label":"Modelo bem","wide":false},{"name":"ano_modelo_bem","label":"Ano modelo bem","wide":false},{"name":"cor_bem","label":"Cor bem","wide":false},{"name":"placa_veiculo","label":"Placa veiculo","wide":false},{"name":"renavam_veiculo","label":"Renavam veiculo","wide":false},{"name":"chassi_ou_serie","label":"Chassi ou serie","wide":false},{"name":"quilometragem_veiculo","label":"Quilometragem veiculo","wide":false},{"name":"descricao_complementar_bem","label":"Descricao complementar bem","wide":true},{"name":"valor_venda","label":"Valor venda","wide":false},{"name":"valor_venda_extenso","label":"Valor venda extenso","wide":false},{"name":"forma_pagamento","label":"Forma pagamento","wide":false},{"name":"data_assinatura","label":"Data assinatura","wide":false},{"name":"estado_conservacao_bem","label":"Estado conservacao bem","wide":false},{"name":"local_entrega_bem","label":"Local entrega bem","wide":false},{"name":"data_entrega_bem","label":"Data entrega bem","wide":false},{"name":"responsavel_transferencia","label":"Responsavel transferencia","wide":false},{"name":"foro_comarca","label":"Foro comarca","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false},{"name":"cpf_testemunha_1","label":"CPF testemunha 1","wide":false},{"name":"cpf_testemunha_2","label":"CPF testemunha 2","wide":false}],"cadastro-confrontantes":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"nome_imovel_rural","label":"Nome imovel rural","wide":false},{"name":"endereco_imovel_rural","label":"Endereco imovel rural","wide":true},{"name":"municipio_imovel","label":"Municipio imovel","wide":false},{"name":"uf_imovel","label":"UF imovel","wide":false},{"name":"area_imovel","label":"Area imovel","wide":false},{"name":"registro_imovel","label":"Registro imovel","wide":false},{"name":"nome_confrontante_norte","label":"Nome confrontante norte","wide":true},{"name":"cpf_cnpj_confrontante_norte","label":"CPF CNPJ confrontante norte","wide":true},{"name":"imovel_confrontante_norte","label":"Imovel confrontante norte","wide":true},{"name":"endereco_confrontante_norte","label":"Endereco confrontante norte","wide":true},{"name":"nome_confrontante_sul","label":"Nome confrontante sul","wide":true},{"name":"cpf_cnpj_confrontante_sul","label":"CPF CNPJ confrontante sul","wide":true},{"name":"imovel_confrontante_sul","label":"Imovel confrontante sul","wide":true},{"name":"endereco_confrontante_sul","label":"Endereco confrontante sul","wide":true},{"name":"nome_confrontante_leste","label":"Nome confrontante leste","wide":true},{"name":"cpf_cnpj_confrontante_leste","label":"CPF CNPJ confrontante leste","wide":true},{"name":"imovel_confrontante_leste","label":"Imovel confrontante leste","wide":true},{"name":"endereco_confrontante_leste","label":"Endereco confrontante leste","wide":true},{"name":"nome_confrontante_oeste","label":"Nome confrontante oeste","wide":true},{"name":"cpf_cnpj_confrontante_oeste","label":"CPF CNPJ confrontante oeste","wide":true},{"name":"imovel_confrontante_oeste","label":"Imovel confrontante oeste","wide":true},{"name":"endereco_confrontante_oeste","label":"Endereco confrontante oeste","wide":true},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"controle-producao-anual":[{"name":"nome_produtor","label":"Nome produtor","wide":true},{"name":"nacionalidade_produtor","label":"Nacionalidade produtor","wide":true},{"name":"estado_civil_produtor","label":"Estado civil produtor","wide":true},{"name":"rg_produtor","label":"RG produtor","wide":true},{"name":"cpf_produtor","label":"CPF produtor","wide":true},{"name":"endereco_produtor","label":"Endereco produtor","wide":true},{"name":"nome_imovel_rural","label":"Nome imovel rural","wide":false},{"name":"endereco_imovel_rural","label":"Endereco imovel rural","wide":true},{"name":"municipio_imovel","label":"Municipio imovel","wide":false},{"name":"uf_imovel","label":"UF imovel","wide":false},{"name":"area_imovel","label":"Area imovel","wide":false},{"name":"registro_rural","label":"Registro rural","wide":false},{"name":"ano_referencia","label":"Ano referencia","wide":false},{"name":"data_inicio_ano","label":"Data inicio ano","wide":false},{"name":"data_fim_ano","label":"Data fim ano","wide":false},{"name":"atividade_1","label":"Atividade 1","wide":true},{"name":"quantidade_produzida_1","label":"Quantidade produzida 1","wide":false},{"name":"unidade_1","label":"Unidade 1","wide":false},{"name":"quantidade_vendida_1","label":"Quantidade vendida 1","wide":false},{"name":"estoque_final_1","label":"Estoque final 1","wide":false},{"name":"valor_total_1","label":"Valor total 1","wide":false},{"name":"atividade_2","label":"Atividade 2","wide":true},{"name":"quantidade_produzida_2","label":"Quantidade produzida 2","wide":false},{"name":"unidade_2","label":"Unidade 2","wide":false},{"name":"quantidade_vendida_2","label":"Quantidade vendida 2","wide":false},{"name":"estoque_final_2","label":"Estoque final 2","wide":false},{"name":"valor_total_2","label":"Valor total 2","wide":false},{"name":"atividade_3","label":"Atividade 3","wide":true},{"name":"quantidade_produzida_3","label":"Quantidade produzida 3","wide":false},{"name":"unidade_3","label":"Unidade 3","wide":false},{"name":"quantidade_vendida_3","label":"Quantidade vendida 3","wide":false},{"name":"estoque_final_3","label":"Estoque final 3","wide":false},{"name":"valor_total_3","label":"Valor total 3","wide":false},{"name":"receita_bruta_anual","label":"Receita bruta anual","wide":false},{"name":"receita_bruta_extenso","label":"Receita bruta extenso","wide":false},{"name":"despesas_anuais","label":"Despesas anuais","wide":false},{"name":"despesas_anuais_extenso","label":"Despesas anuais extenso","wide":false},{"name":"saldo_estimado","label":"Saldo estimado","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"controle-rebanho":[{"name":"nome_produtor","label":"Nome produtor","wide":true},{"name":"nacionalidade_produtor","label":"Nacionalidade produtor","wide":true},{"name":"estado_civil_produtor","label":"Estado civil produtor","wide":true},{"name":"rg_produtor","label":"RG produtor","wide":true},{"name":"cpf_produtor","label":"CPF produtor","wide":true},{"name":"endereco_produtor","label":"Endereco produtor","wide":true},{"name":"nome_propriedade","label":"Nome propriedade","wide":false},{"name":"endereco_propriedade","label":"Endereco propriedade","wide":true},{"name":"municipio_propriedade","label":"Municipio propriedade","wide":false},{"name":"uf_propriedade","label":"UF propriedade","wide":false},{"name":"registro_propriedade","label":"Registro propriedade","wide":false},{"name":"data_inicio_controle","label":"Data inicio controle","wide":false},{"name":"data_fim_controle","label":"Data fim controle","wide":false},{"name":"ano_controle","label":"Ano controle","wide":false},{"name":"especie_1","label":"Especie 1","wide":false},{"name":"categoria_1","label":"Categoria 1","wide":false},{"name":"quantidade_inicial_1","label":"Quantidade inicial 1","wide":false},{"name":"entradas_1","label":"Entradas 1","wide":false},{"name":"saidas_1","label":"Saidas 1","wide":false},{"name":"quantidade_final_1","label":"Quantidade final 1","wide":false},{"name":"especie_2","label":"Especie 2","wide":false},{"name":"categoria_2","label":"Categoria 2","wide":false},{"name":"quantidade_inicial_2","label":"Quantidade inicial 2","wide":false},{"name":"entradas_2","label":"Entradas 2","wide":false},{"name":"saidas_2","label":"Saidas 2","wide":false},{"name":"quantidade_final_2","label":"Quantidade final 2","wide":false},{"name":"especie_3","label":"Especie 3","wide":false},{"name":"categoria_3","label":"Categoria 3","wide":false},{"name":"quantidade_inicial_3","label":"Quantidade inicial 3","wide":false},{"name":"entradas_3","label":"Entradas 3","wide":false},{"name":"saidas_3","label":"Saidas 3","wide":false},{"name":"quantidade_final_3","label":"Quantidade final 3","wide":false},{"name":"total_nascimentos","label":"Total nascimentos","wide":false},{"name":"total_compras","label":"Total compras","wide":false},{"name":"total_vendas","label":"Total vendas","wide":false},{"name":"total_mortes","label":"Total mortes","wide":false},{"name":"total_transferencias","label":"Total transferencias","wide":false},{"name":"controle_sanitario","label":"Controle sanitario","wide":false},{"name":"vacinacao_rebanho","label":"Vacinacao rebanho","wide":false},{"name":"forma_identificacao","label":"Forma identificacao","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"inventario-producao-rural":[{"name":"nome_produtor","label":"Nome produtor","wide":true},{"name":"nacionalidade_produtor","label":"Nacionalidade produtor","wide":true},{"name":"estado_civil_produtor","label":"Estado civil produtor","wide":true},{"name":"rg_produtor","label":"RG produtor","wide":true},{"name":"cpf_produtor","label":"CPF produtor","wide":true},{"name":"endereco_produtor","label":"Endereco produtor","wide":true},{"name":"nome_imovel_rural","label":"Nome imovel rural","wide":false},{"name":"endereco_imovel_rural","label":"Endereco imovel rural","wide":true},{"name":"municipio_imovel","label":"Municipio imovel","wide":false},{"name":"uf_imovel","label":"UF imovel","wide":false},{"name":"area_imovel","label":"Area imovel","wide":false},{"name":"registro_rural","label":"Registro rural","wide":false},{"name":"data_inicio_periodo","label":"Data inicio periodo","wide":false},{"name":"data_fim_periodo","label":"Data fim periodo","wide":false},{"name":"ano_safra","label":"Ano safra","wide":false},{"name":"produto_1","label":"Produto 1","wide":true},{"name":"area_produto_1","label":"Area produto 1","wide":true},{"name":"quantidade_produto_1","label":"Quantidade produto 1","wide":true},{"name":"unidade_produto_1","label":"Unidade produto 1","wide":true},{"name":"valor_produto_1","label":"Valor produto 1","wide":true},{"name":"produto_2","label":"Produto 2","wide":true},{"name":"area_produto_2","label":"Area produto 2","wide":true},{"name":"quantidade_produto_2","label":"Quantidade produto 2","wide":true},{"name":"unidade_produto_2","label":"Unidade produto 2","wide":true},{"name":"valor_produto_2","label":"Valor produto 2","wide":true},{"name":"produto_3","label":"Produto 3","wide":true},{"name":"area_produto_3","label":"Area produto 3","wide":true},{"name":"quantidade_produto_3","label":"Quantidade produto 3","wide":true},{"name":"unidade_produto_3","label":"Unidade produto 3","wide":true},{"name":"valor_produto_3","label":"Valor produto 3","wide":true},{"name":"local_armazenamento","label":"Local armazenamento","wide":false},{"name":"destino_producao","label":"Destino producao","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"contrato-arrendamento-rural":[{"name":"nome_arrendador","label":"Nome arrendador","wide":false},{"name":"nacionalidade_arrendador","label":"Nacionalidade arrendador","wide":false},{"name":"estado_civil_arrendador","label":"Estado civil arrendador","wide":false},{"name":"profissao_arrendador","label":"Profissao arrendador","wide":false},{"name":"rg_arrendador","label":"RG arrendador","wide":false},{"name":"cpf_cnpj_arrendador","label":"CPF CNPJ arrendador","wide":false},{"name":"endereco_arrendador","label":"Endereco arrendador","wide":true},{"name":"nome_arrendatario","label":"Nome arrendatario","wide":false},{"name":"nacionalidade_arrendatario","label":"Nacionalidade arrendatario","wide":false},{"name":"estado_civil_arrendatario","label":"Estado civil arrendatario","wide":false},{"name":"profissao_arrendatario","label":"Profissao arrendatario","wide":false},{"name":"rg_arrendatario","label":"RG arrendatario","wide":false},{"name":"cpf_cnpj_arrendatario","label":"CPF CNPJ arrendatario","wide":false},{"name":"endereco_arrendatario","label":"Endereco arrendatario","wide":true},{"name":"denominacao_imovel","label":"Denominacao imovel","wide":false},{"name":"area_total_ha","label":"Area total ha","wide":false},{"name":"localizacao_imovel","label":"Localizacao imovel","wide":false},{"name":"municipio","label":"Município","wide":false},{"name":"uf","label":"UF","wide":false},{"name":"matricula_imovel","label":"Matricula imovel","wide":false},{"name":"ccir_incra","label":"Ccir incra","wide":false},{"name":"car_imovel","label":"Car imovel","wide":false},{"name":"confrontacoes_imovel","label":"Confrontacoes imovel","wide":true},{"name":"finalidade_arrendamento","label":"Finalidade arrendamento","wide":true},{"name":"prazo_arrendamento","label":"Prazo arrendamento","wide":false},{"name":"data_inicio","label":"Data de início","wide":false},{"name":"data_fim","label":"Data fim","wide":false},{"name":"valor_arrendamento","label":"Valor arrendamento","wide":false},{"name":"valor_arrendamento_extenso","label":"Valor arrendamento extenso","wide":false},{"name":"dia_vencimento","label":"Dia vencimento","wide":false},{"name":"periodicidade_pagamento","label":"Periodicidade pagamento","wide":false},{"name":"forma_pagamento","label":"Forma pagamento","wide":false},{"name":"indice_reajuste","label":"Indice reajuste","wide":false},{"name":"prazo_inadimplencia","label":"Prazo inadimplencia","wide":false},{"name":"prazo_aviso_rescisao","label":"Prazo aviso rescisao","wide":false},{"name":"foro_comarca","label":"Foro comarca","wide":false},{"name":"foro_uf","label":"Foro UF","wide":false},{"name":"numero_vias","label":"Numero vias","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"contrato-comodato-equipamentos":[{"name":"nome_comodante","label":"Nome comodante","wide":false},{"name":"nacionalidade_comodante","label":"Nacionalidade comodante","wide":false},{"name":"estado_civil_comodante","label":"Estado civil comodante","wide":false},{"name":"profissao_comodante","label":"Profissao comodante","wide":false},{"name":"rg_comodante","label":"RG comodante","wide":false},{"name":"cpf_cnpj_comodante","label":"CPF CNPJ comodante","wide":false},{"name":"endereco_comodante","label":"Endereco comodante","wide":true},{"name":"nome_comodatario","label":"Nome completo do comodatário","wide":false},{"name":"nacionalidade_comodatario","label":"Nacionalidade comodatario","wide":false},{"name":"estado_civil_comodatario","label":"Estado civil do comodatário","wide":false},{"name":"profissao_comodatario","label":"Profissao comodatario","wide":false},{"name":"rg_comodatario","label":"RG do comodatário","wide":false},{"name":"cpf_cnpj_comodatario","label":"CPF CNPJ comodatario","wide":false},{"name":"endereco_comodatario","label":"Endereco comodatario","wide":true},{"name":"finalidade_uso_equipamento","label":"Finalidade uso equipamento","wide":true},{"name":"equipamento_1","label":"Equipamento 1","wide":false},{"name":"marca_modelo_1","label":"Marca modelo 1","wide":false},{"name":"serie_chassi_1","label":"Serie chassi 1","wide":false},{"name":"estado_conservacao_1","label":"Estado conservacao 1","wide":false},{"name":"acessorios_1","label":"Acessorios 1","wide":false},{"name":"equipamento_2","label":"Equipamento 2","wide":false},{"name":"marca_modelo_2","label":"Marca modelo 2","wide":false},{"name":"serie_chassi_2","label":"Serie chassi 2","wide":false},{"name":"estado_conservacao_2","label":"Estado conservacao 2","wide":false},{"name":"acessorios_2","label":"Acessorios 2","wide":false},{"name":"equipamento_3","label":"Equipamento 3","wide":false},{"name":"marca_modelo_3","label":"Marca modelo 3","wide":false},{"name":"serie_chassi_3","label":"Serie chassi 3","wide":false},{"name":"estado_conservacao_3","label":"Estado conservacao 3","wide":false},{"name":"acessorios_3","label":"Acessorios 3","wide":false},{"name":"prazo_comodato","label":"Prazo comodato","wide":false},{"name":"data_inicio","label":"Data de início","wide":false},{"name":"data_fim","label":"Data fim","wide":false},{"name":"responsavel_despesas","label":"Responsavel despesas","wide":false},{"name":"regra_manutencao_extraordinaria","label":"Regra manutencao extraordinaria","wide":false},{"name":"foro_comarca","label":"Foro comarca","wide":false},{"name":"foro_uf","label":"Foro UF","wide":false},{"name":"numero_vias","label":"Numero vias","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"contrato-parceria-rural":[{"name":"nome_outorgante","label":"Nome outoRGante","wide":false},{"name":"nacionalidade_outorgante","label":"Nacionalidade outoRGante","wide":false},{"name":"estado_civil_outorgante","label":"Estado civil outoRGante","wide":false},{"name":"profissao_outorgante","label":"Profissao outoRGante","wide":false},{"name":"rg_outorgante","label":"RG outoRGante","wide":false},{"name":"cpf_cnpj_outorgante","label":"CPF CNPJ outoRGante","wide":false},{"name":"endereco_outorgante","label":"Endereco outoRGante","wide":true},{"name":"nome_outorgado","label":"Nome outoRGado","wide":false},{"name":"nacionalidade_outorgado","label":"Nacionalidade outoRGado","wide":false},{"name":"estado_civil_outorgado","label":"Estado civil outoRGado","wide":false},{"name":"profissao_outorgado","label":"Profissao outoRGado","wide":false},{"name":"rg_outorgado","label":"RG outoRGado","wide":false},{"name":"cpf_cnpj_outorgado","label":"CPF CNPJ outoRGado","wide":false},{"name":"endereco_outorgado","label":"Endereco outoRGado","wide":true},{"name":"denominacao_area","label":"Denominacao area","wide":false},{"name":"area_parceria_ha","label":"Area parceria ha","wide":false},{"name":"localizacao_area","label":"Localizacao area","wide":false},{"name":"municipio","label":"Município","wide":false},{"name":"uf","label":"UF","wide":false},{"name":"matricula_area","label":"Matricula area","wide":false},{"name":"atividade_parceria","label":"Atividade parceria","wide":true},{"name":"descricao_atividade","label":"Descricao atividade","wide":true},{"name":"percentual_outorgante","label":"Percentual outoRGante","wide":false},{"name":"percentual_outorgado","label":"Percentual outoRGado","wide":false},{"name":"periodicidade_apuracao","label":"Periodicidade apuracao","wide":false},{"name":"divisao_despesas","label":"Divisao despesas","wide":false},{"name":"prazo_parceria","label":"Prazo parceria","wide":false},{"name":"data_inicio","label":"Data de início","wide":false},{"name":"data_fim","label":"Data fim","wide":false},{"name":"periodicidade_prestacao_contas","label":"Periodicidade prestacao contas","wide":false},{"name":"prazo_aviso_rescisao","label":"Prazo aviso rescisao","wide":false},{"name":"foro_comarca","label":"Foro comarca","wide":false},{"name":"foro_uf","label":"Foro UF","wide":false},{"name":"numero_vias","label":"Numero vias","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-posse-mansa-pacifica":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_cnpj_declarante","label":"CPF CNPJ declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"denominacao_imovel","label":"Denominacao imovel","wide":false},{"name":"localizacao_imovel","label":"Localizacao imovel","wide":false},{"name":"municipio","label":"Município","wide":false},{"name":"uf","label":"UF","wide":false},{"name":"area_aproximada","label":"Area aproximada","wide":false},{"name":"coordenadas_referencia","label":"Coordenadas referencia","wide":false},{"name":"confrontante_norte","label":"Confrontante norte","wide":true},{"name":"confrontante_sul","label":"Confrontante sul","wide":true},{"name":"confrontante_leste","label":"Confrontante leste","wide":true},{"name":"confrontante_oeste","label":"Confrontante oeste","wide":true},{"name":"data_inicio_posse","label":"Data inicio posse","wide":false},{"name":"finalidade_uso","label":"Finalidade uso","wide":true},{"name":"benfeitorias_atividades","label":"Benfeitorias atividades","wide":true},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-residencia":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"endereco_residencia","label":"Endereco residencia","wide":true},{"name":"bairro_residencia","label":"Bairro residencia","wide":false},{"name":"cidade_residencia","label":"Cidade residencia","wide":false},{"name":"uf_residencia","label":"UF residencia","wide":false},{"name":"cep_residencia","label":"Cep residencia","wide":false},{"name":"data_inicio_residencia","label":"Data inicio residencia","wide":false},{"name":"nome_titular_comprovante","label":"Nome titular comprovante","wide":false},{"name":"cpf_titular_comprovante","label":"CPF titular comprovante","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-nao-possuir-renda":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"valor_ajuda_eventual","label":"Valor ajuda eventual","wide":false},{"name":"forma_manutencao","label":"Forma manutencao","wide":false},{"name":"nome_responsavel_ajuda","label":"Nome responsavel ajuda","wide":false},{"name":"cpf_responsavel_ajuda","label":"CPF responsavel ajuda","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-agricultura-familiar":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"nome_imovel_rural","label":"Nome imovel rural","wide":false},{"name":"endereco_imovel_rural","label":"Endereco imovel rural","wide":true},{"name":"municipio_imovel_rural","label":"Municipio imovel rural","wide":false},{"name":"uf_imovel_rural","label":"UF imovel rural","wide":false},{"name":"produtos_agricultura_familiar","label":"Produtos agricultura familiar","wide":true},{"name":"membros_familiares_atividade","label":"Membros familiares atividade","wide":true},{"name":"fonte_renda_agricultura_familiar","label":"Fonte renda agricultura familiar","wide":false},{"name":"data_inicio_agricultura_familiar","label":"Data inicio agricultura familiar","wide":false},{"name":"area_explorada","label":"Area explorada","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-dependencia-economica":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"nome_dependente","label":"Nome dependente","wide":false},{"name":"parentesco_dependente","label":"Parentesco dependente","wide":false},{"name":"cpf_dependente","label":"CPF dependente","wide":false},{"name":"data_inicio_dependencia","label":"Data inicio dependencia","wide":false},{"name":"motivo_dependencia","label":"Motivo dependencia","wide":false},{"name":"renda_dependente","label":"Renda dependente","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-convivencia-familiar":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"nome_familiar_convivente","label":"Nome familiar convivente","wide":false},{"name":"cpf_familiar_convivente","label":"CPF familiar convivente","wide":false},{"name":"grau_parentesco_convivente","label":"Grau parentesco convivente","wide":false},{"name":"data_inicio_convivencia","label":"Data inicio convivencia","wide":false},{"name":"endereco_convivencia_familiar","label":"Endereco convivencia familiar","wide":true},{"name":"finalidade_declaracao","label":"Finalidade declaracao","wide":true},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-baixa-renda":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"renda_mensal_individual","label":"Renda mensal individual","wide":false},{"name":"renda_familiar_mensal","label":"Renda familiar mensal","wide":false},{"name":"quantidade_membros_familiares","label":"Quantidade membros familiares","wide":true},{"name":"nomes_membros_familiares","label":"Nomes membros familiares","wide":true},{"name":"renda_per_capita","label":"Renda per capita","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-autenticidade-documentos":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"lista_documentos_autenticados","label":"Lista documentos autenticados","wide":true},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-atividade-rural":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"funcao_rural","label":"Funcao rural","wide":false},{"name":"descricao_atividade_rural","label":"Descricao atividade rural","wide":true},{"name":"nome_imovel_rural","label":"Nome imovel rural","wide":false},{"name":"endereco_imovel_rural","label":"Endereco imovel rural","wide":true},{"name":"municipio_imovel_rural","label":"Municipio imovel rural","wide":false},{"name":"uf_imovel_rural","label":"UF imovel rural","wide":false},{"name":"data_inicio_atividade_rural","label":"Data inicio atividade rural","wide":true},{"name":"data_fim_atividade_rural","label":"Data fim atividade rural","wide":true},{"name":"forma_exercicio_atividade","label":"Forma exercicio atividade","wide":true},{"name":"renda_media_rural","label":"Renda media rural","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-uniao-estavel":[{"name":"nome_convivente_1","label":"Nome convivente 1","wide":false},{"name":"nacionalidade_convivente_1","label":"Nacionalidade convivente 1","wide":false},{"name":"estado_civil_convivente_1","label":"Estado civil convivente 1","wide":false},{"name":"profissao_convivente_1","label":"Profissao convivente 1","wide":false},{"name":"rg_convivente_1","label":"RG convivente 1","wide":false},{"name":"cpf_convivente_1","label":"CPF convivente 1","wide":false},{"name":"endereco_convivente_1","label":"Endereco convivente 1","wide":true},{"name":"nome_convivente_2","label":"Nome convivente 2","wide":false},{"name":"nacionalidade_convivente_2","label":"Nacionalidade convivente 2","wide":false},{"name":"estado_civil_convivente_2","label":"Estado civil convivente 2","wide":false},{"name":"profissao_convivente_2","label":"Profissao convivente 2","wide":false},{"name":"rg_convivente_2","label":"RG convivente 2","wide":false},{"name":"cpf_convivente_2","label":"CPF convivente 2","wide":false},{"name":"endereco_convivente_2","label":"Endereco convivente 2","wide":true},{"name":"data_inicio_uniao_estavel","label":"Data inicio uniao estavel","wide":false},{"name":"endereco_residencia_casal","label":"Endereco residencia casal","wide":true},{"name":"regime_bens_uniao","label":"Regime bens uniao","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}],"declaracao-tempo-trabalho-rural":[{"name":"nome_declarante","label":"Nome declarante","wide":false},{"name":"nacionalidade_declarante","label":"Nacionalidade declarante","wide":false},{"name":"estado_civil_declarante","label":"Estado civil declarante","wide":false},{"name":"profissao_declarante","label":"Profissao declarante","wide":false},{"name":"rg_declarante","label":"RG declarante","wide":false},{"name":"cpf_declarante","label":"CPF declarante","wide":false},{"name":"endereco_declarante","label":"Endereco declarante","wide":true},{"name":"data_inicio_trabalho_rural","label":"Data inicio trabalho rural","wide":false},{"name":"data_fim_trabalho_rural","label":"Data fim trabalho rural","wide":false},{"name":"nome_propriedade_rural","label":"Nome propriedade rural","wide":false},{"name":"endereco_propriedade_rural","label":"Endereco propriedade rural","wide":true},{"name":"municipio_propriedade_rural","label":"Municipio propriedade rural","wide":false},{"name":"uf_propriedade_rural","label":"UF propriedade rural","wide":false},{"name":"atividades_desempenhadas","label":"Atividades desempenhadas","wide":true},{"name":"condicao_trabalho_rural","label":"Condicao trabalho rural","wide":false},{"name":"frequencia_trabalho_rural","label":"Frequencia trabalho rural","wide":false},{"name":"nome_responsavel_propriedade","label":"Nome responsavel propriedade","wide":false},{"name":"cpf_responsavel_propriedade","label":"CPF responsavel propriedade","wide":false},{"name":"orgao_destino","label":"ORGao destino","wide":false},{"name":"cidade_assinatura","label":"Cidade assinatura","wide":false},{"name":"uf_assinatura","label":"UF assinatura","wide":false},{"name":"data_assinatura_extenso","label":"Data assinatura extenso","wide":false}]};


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


    function normalizeDocumentDefinitionsFromTemplates() {
        DOCS.forEach((doc) => {
            const cleanFields = DOCSPACE_TEMPLATE_FIELDS[doc.id];
            if (Array.isArray(cleanFields) && cleanFields.length) {
                const seen = new Set();
                doc.fields = cleanFields
                    .map(normalizeTemplateFieldForUi)
                    .filter((field) => {
                        const key = String(field.name || '').trim();
                        if (!key || seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
            }

            if (doc.id === 'comodato') {
                doc.choices = [
                    {
                        name: 'possui_conjuge',
                        label: 'O comodante possui cônjuge ou companheiro(a)?',
                        options: [
                            { value: 'nao', label: 'Não' },
                            { value: 'sim', label: 'Sim' },
                        ],
                    },
                    {
                        name: 'possui_obito',
                        label: 'O comodante é falecido?',
                        options: [
                            { value: 'nao', label: 'Não' },
                            { value: 'sim', label: 'Sim' },
                        ],
                    },
                ];
            }

            if (doc.id === 'autodeclaracao-rural') {
                doc.choices = [
                    {
                        name: 'possui_representacao',
                        label: 'A autodeclaração terá representante?',
                        options: [
                            { value: 'nao', label: 'Sem representação' },
                            { value: 'sim', label: 'Com representação' },
                        ],
                    },
                ];
            }
        });
    }

    normalizeDocumentDefinitionsFromTemplates();
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
        { id: "test10c", label: "Teste Mercado Pago", price: "R$ 0,10" },
        { id: "basic30", label: "Plano Básico", price: "R$ 39,90" },
        { id: "proMax365", label: "Plano Pro Max", price: "R$ 490,90" },
    ];
    const PDF_TOOLS = {
        merge: { title: "Juntar PDFs", description: "Combine vários PDFs em um único arquivo.", accept: ".pdf,application/pdf", multiple: true },
        split: { title: "Dividir PDF", description: "Baixe páginas selecionadas em PDFs separados.", accept: ".pdf,application/pdf", pages: "Páginas opcional: 1,3-5" },
        organize: { title: "Organizar páginas", description: "Crie um PDF na ordem informada.", accept: ".pdf,application/pdf", pages: "Nova ordem: 3,1,2,4-6", requiredPages: true },
        remove: { title: "Remover páginas", description: "Exclua páginas específicas.", accept: ".pdf,application/pdf", pages: "Remover: 2,4-6", requiredPages: true },
        extract: { title: "Extrair páginas", description: "Gere um novo PDF só com as páginas escolhidas.", accept: ".pdf,application/pdf", pages: "Extrair: 1,3-5", requiredPages: true },
        rotate: { title: "Girar páginas", description: "Gire todas as páginas ou apenas as informadas.", accept: ".pdf,application/pdf", pages: "Páginas opcional", rotation: true },
        compress: { title: "Comprimir PDF", description: "Envia para a API de compressão configurada no Worker.", accept: ".pdf,application/pdf", pages: "Páginas específicas opcional", compression: true, server: true },
        images: { title: "Imagens para PDF", description: "Transforme JPG/PNG em PDF.", accept: ".jpg,.jpeg,.png,image/jpeg,image/png", multiple: true },
        wordPdf: { title: "Word para PDF", description: "Converte DOCX para PDF simples no navegador.", accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        ocr: { title: "PDF pesquisável com OCR", description: "Envia para a API de OCR configurada no Worker.", accept: ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp", multiple: true, ocr: true, server: true },
    };
    const state = {
        view: "dashboard",
        category: "todos",
        query: "",
        user: null,
        documentUsage: null,
        pdfToolUsage: null,
        activeDocId: null,
        activePdfTool: "merge",
        adminUsers: [],
        supportMessages: [],
        adminSupportMessages: [],
        appRelease: null,
        aiConversationId: null,
    };

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const refs = {};

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        refs.authView = $("#authView");
        refs.appView = $("#appView");
        refs.content = $("#content");
        refs.loginForm = $("#loginForm");
        refs.loginEmail = $("#loginEmail");
        refs.loginPassword = $("#loginPassword");
        refs.loginButton = $("#loginButton");
        refs.loginMessage = $("#loginMessage");
        refs.pageTitle = $("#pageTitle");
        refs.pageKicker = $("#pageKicker");
        refs.userName = $("#userName");
        refs.userEmail = $("#userEmail");
        refs.userInitials = $("#userInitials");
        refs.adminNavButton = $("#adminNavButton");
        refs.toast = $("#toast");

        refs.loginForm.addEventListener("submit", handleLogin);
        $("#logoutButton").addEventListener("click", logout);
        $("#mainNav").addEventListener("click", (event) => {
            const button = event.target.closest("[data-view]");
            if (!button) return;
            navigate(button.dataset.view);
        });
        refs.content.addEventListener("click", handleContentClick);
        refs.content.addEventListener("submit", handleContentSubmit);
        refs.content.addEventListener("input", handleContentInput);
        refs.content.addEventListener("change", handleContentChange);

        registerServiceWorker();
        checkSession();
    }

    async function registerServiceWorker() {
        if ("serviceWorker" in navigator) {
            try { await navigator.serviceWorker.register("service-worker.js?v=120"); } catch (error) { console.warn("Service Worker não registrado", error); }
        }
    }

    async function checkSession() {
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        if (!token) {
            showAuth();
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
        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: { email: refs.loginEmail.value.trim(), password: refs.loginPassword.value },
                allowBillingToken: true,
            });
            applySession(data);
            showApp();
            navigate("dashboard");
            toast(data.message || "Login realizado com sucesso.", "success");
        } catch (error) {
            if (error.data?.billingToken) {
                localStorage.setItem(BILLING_TOKEN_KEY, error.data.billingToken);
                state.user = error.data.user || null;
                showApp();
                navigate("billing");
                toast(error.message || "Acesso bloqueado. Regularize o plano.", "error");
                return;
            }
            refs.loginMessage.textContent = translateError(error);
            refs.loginMessage.className = "message error";
        } finally {
            setLoginLoading(false);
        }
    }

    async function logout() {
        try { await apiRequest("/api/auth/logout", { method: "POST" }); } catch (_) {}
        localStorage.removeItem(SESSION_TOKEN_KEY);
        localStorage.removeItem(BILLING_TOKEN_KEY);
        state.user = null;
        showAuth();
    }

    function applySession(data) {
        if (data.sessionToken) localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
        state.user = data.user || state.user;
        state.documentUsage = data.documentUsage || state.documentUsage;
        state.pdfToolUsage = data.pdfToolUsage || state.pdfToolUsage;
        updateUserChrome();
    }

    function showAuth(message = "") {
        refs.authView.classList.remove("is-hidden");
        refs.appView.classList.add("is-hidden");
        refs.loginMessage.textContent = message || "";
        refs.loginMessage.className = message ? "message error" : "message";
    }

    function showApp() {
        refs.authView.classList.add("is-hidden");
        refs.appView.classList.remove("is-hidden");
        updateUserChrome();
    }

    function setLoginLoading(loading) {
        refs.loginButton.disabled = loading;
        refs.loginButton.textContent = loading ? "Entrando..." : "Entrar no sistema";
    }

    function updateUserChrome() {
        const user = state.user || {};
        refs.userName.textContent = user.name || "Usuário";
        refs.userEmail.textContent = user.email || "";
        refs.userInitials.textContent = initials(user.name || user.email || "DS");
        refs.adminNavButton.classList.toggle("is-hidden", !isAdmin());
    }

    function navigate(view) {
        if (view === "admin" && !isAdmin()) return;
        state.view = view;
        $$("#mainNav [data-view]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.view === view));
        render();
    }

    function render() {
        const titles = {
            dashboard: ["Painel", "Início"], documents: ["Modelos", "Documentos"], pdf: ["Ferramentas", "PDF"],
            support: ["Atendimento", "Suporte"], admin: ["Administração", "Admin"], billing: ["Assinatura", "Planos"], ai: ["Assistente", "IA"],
        };
        const [kicker, title] = titles[state.view] || titles.dashboard;
        refs.pageKicker.textContent = kicker;
        refs.pageTitle.textContent = title;
        if (state.view === "dashboard") renderDashboard();
        if (state.view === "documents") renderDocuments();
        if (state.view === "pdf") renderPdfTools();
        if (state.view === "support") renderSupport();
        if (state.view === "billing") renderBilling();
        if (state.view === "ai") renderAI();
        if (state.view === "admin") renderAdmin();
        initIcons();
    }

    function renderDashboard() {
        const user = state.user || {};
        const docsRemaining = getTotalRemainingDocuments();
        const pdfRemaining = getTotalRemainingPdf();
        refs.content.innerHTML = `
            <div class="hero-grid">
                <article class="panel">
                    <p class="eyebrow">${escapeHtml(APP_VERSION)}</p>
                    <h2>Olá, ${escapeHtml(user.name || "usuário")}.</h2>
                    <p>Esta versão foi refeita de novo, sem a cara anterior. O foco agora é trabalho: escolher documento, preencher por etapas e gerar o arquivo sem bagunça.</p>
                    <div class="action-row">
                        <button class="primary-button" data-goto="documents">Preencher documento</button>
                        <button class="secondary-button" data-goto="pdf">Ferramentas de PDF</button>
                        ${isAdmin() ? '<button class="secondary-button" data-goto="admin">Administração</button>' : ''}
                    </div>
                </article>
                <article class="panel">
                    <p class="eyebrow">Conta</p>
                    <h2>Status do acesso</h2>
                    <p><strong>Plano:</strong> ${escapeHtml(user.planLabel || user.plan || "Não informado")}</p>
                    <p><strong>Status:</strong> ${escapeHtml(user.status || "ativo")}</p>
                    <p><strong>Vencimento:</strong> ${formatDate(user.expiresAt || user.expires_at)}</p>
                </article>
            </div>
            <div class="stat-grid">
                <div class="stat"><small>Documentos disponíveis</small><strong>${state.documentUsage?.unlimited ? "∞" : docsRemaining}</strong></div>
                <div class="stat"><small>Ferramentas PDF</small><strong>${state.pdfToolUsage?.unlimited ? "∞" : pdfRemaining}</strong></div>
                <div class="stat"><small>Modelos cadastrados</small><strong>${DOCS.length}</strong></div>
            </div>
            <article class="panel">
                <p class="eyebrow">Acesso rápido</p>
                <h2>Modelos principais</h2>
                <div class="grid">${DOCS.slice(0, 6).map(docCard).join("")}</div>
            </article>
        `;
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
                <div class="library-header">
                    <div>
                        <p class="eyebrow">Documentos</p>
                        <h2>Escolha um modelo</h2>
                        <p>O preenchimento agora abre como assistente em etapas. Dados de confrontante/confrontações ficam em uma parte separada para não misturar tudo.</p>
                    </div>
                    <input id="documentSearchZero" class="search-input" type="search" placeholder="Buscar contrato, declaração, confrontante..." value="${escapeHtml(state.query)}">
                </div>
                <div class="chip-row" style="margin-top:14px">${CATEGORIES.map((cat) => `<button data-category="${cat.id}" class="${state.category === cat.id ? "is-active" : ""}">${escapeHtml(cat.label)}</button>`).join("")}</div>
            </article>
            <div class="grid">${filtered.map(docCard).join("")}</div>
            ${state.activeDocId ? renderDocumentForm(DOC_MAP.get(state.activeDocId)) : ""}
        `;
    }

    function docCard(doc) {
        const quota = getDocQuota(doc.id);
        const blocked = quota.blocked;
        const remaining = quota.remaining;
        return `<article class="document-card">
            <button data-doc-open="${escapeAttr(doc.id)}">
                <span class="badge">${escapeHtml(categoryLabel(doc.category))}</span>
                <h3>${escapeHtml(doc.title)}</h3>
                <p>${escapeHtml(doc.description || "Modelo pronto para preenchimento guiado.")}</p>
                <div class="card-meta">
                    <span class="badge ${blocked ? "warn" : ""}">${state.documentUsage?.unlimited ? "Ilimitado" : blocked ? "Sem saldo" : `${remaining} restante(s)`}</span>
                    <span class="badge">${countDocumentFields(doc)} campos</span>
                    <span class="badge">Etapas</span>
                </div>
            </button>
        </article>`;
    }

    function renderDocumentForm(doc) {
        if (!doc) return "";
        const steps = buildDocumentSteps(doc);
        return `<article class="panel" id="documentFormCard">
            <p class="eyebrow">Preenchimento guiado</p>
            <h2>${escapeHtml(doc.title)}</h2>
            <p>${escapeHtml(doc.description || "Preencha os campos abaixo.")}</p>
            <form id="documentGenerateForm" data-document-id="${escapeAttr(doc.id)}" data-current-step="0">
                <div class="wizard-shell">
                    <aside class="wizard-rail">
                        <h3>Partes do documento</h3>
                        <ol class="wizard-steps">
                            ${steps.map((step, index) => `<li class="${index === 0 ? "is-active" : ""}" data-step-indicator="${index}"><b>${index + 1}</b><span>${escapeHtml(step.title)}</span></li>`).join("")}
                        </ol>
                    </aside>
                    <div class="wizard-main">
                        ${steps.map((step, index) => renderWizardStep(step, index, steps.length)).join("")}
                    </div>
                </div>
            </form>
        </article>`;
    }

    function renderWizardStep(step, index, total) {
        const isLast = index === total - 1;
        const isFirst = index === 0;
        return `<section class="wizard-step ${isFirst ? "is-active" : ""}" data-step-panel="${index}">
            <div class="step-head">
                <p class="eyebrow">Etapa ${index + 1} de ${total}</p>
                <h3>${escapeHtml(step.title)}</h3>
                <p>${escapeHtml(step.description || "Preencha esta parte e continue.")}</p>
            </div>
            <div class="form-grid">
                ${step.items.length ? step.items.map(renderWizardItem).join("") : `<div class="summary-box field wide">Revise os dados preenchidos. Depois gere o Word ou PDF.</div>`}
                ${isLast ? `<div class="field wide"><p id="documentFormMessage" class="message"></p></div>` : ""}
                <div class="wizard-actions">
                    <button class="ghost-button" type="button" data-close-doc>Fechar</button>
                    <div class="right">
                        ${!isFirst ? `<button class="secondary-button" type="button" data-doc-step-prev>Voltar</button>` : ""}
                        ${!isLast ? `<button class="primary-button" type="button" data-doc-step-next>Continuar</button>` : `
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
        return `<input ${common} ${inputModeFor(name)} list="${escapeAttr(id)}"><datalist id="${escapeAttr(id)}">${options.map((value) => `<option value="${escapeAttr(value)}"></option>`).join("")}</datalist>`;
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
        const common = `name="${escapeAttr(name)}" data-field-name="${escapeAttr(name)}" placeholder="${escapeAttr(placeholderFor(name))}" autocomplete="off"`;

        let control = "";
        if (selectType) {
            control = renderSimplifiedSelect(name, selectType);
        } else if (textarea) {
            control = `<textarea ${common}></textarea>`;
        } else if (datalistType) {
            control = renderSimplifiedDatalist(name, common, datalistType);
        } else {
            control = `<input ${common} ${inputModeFor(name)}>`;
        }

        return `<label class="field${wide}"><span>${escapeHtml(label)}</span>${control}</label>`;
    }

    async function generateDocument(event) {
        if (event?.preventDefault) event.preventDefault();

        const form = event.target?.closest?.("#documentGenerateForm") || event.target;
        const submitter = event.submitter || document.activeElement?.closest?.("[data-generate-type]");
        const generateType = submitter?.dataset?.generateType || "docx";
        const doc = DOC_MAP.get(form.dataset.documentId);

        if (!doc) return;

        const msg = $("#documentFormMessage");
        setMessage(msg, generateType === "pdf" ? "Preparando PDF..." : "Preparando Word...", "");

        let data = {};
        try {
            // IMPORTANTE: coleta antes de desabilitar o formulário.
            // Inputs desabilitados não entram no FormData e isso estava gerando Word/PDF vazio.
            data = collectFormData(form, doc);
            setFormLoading(form, true);

            ensureDocumentAvailable(doc.id);
            await ensureDocxLibs();

            const modelPath = getModelPath(doc, data);
            const fileName = getFileName(doc, data, generateType === "pdf" ? "pdf" : "docx");
            const docxBlob = await buildDocx(modelPath, data);

            if (generateType === "pdf") {
                if (!API_BASE_URL) {
                    throw new Error("API_BASE_URL não configurada em app-config.js. O PDF precisa do Worker/API para converter DOCX em PDF.");
                }

                const docxBase64 = await blobToBase64(docxBlob, true);
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

                downloadBase64(
                    response.pdfBase64,
                    response.fileName || fileName.replace(/\.docx$/i, ".pdf"),
                    "application/pdf"
                );

                setMessage(msg, response.message || "PDF baixado com sucesso.", "success");
            } else {
                // Primeiro baixa o Word; depois tenta registrar o uso na API.
                // Assim uma falha temporária de API não impede o download do DOCX já montado.
                saveBlob(docxBlob, fileName);

                apiRequest("/api/documents/usage", {
                    method: "POST",
                    body: { documentType: doc.id },
                }).then((r) => {
                    if (r.documentUsage) state.documentUsage = r.documentUsage;
                }).catch((usageError) => {
                    console.warn("Não foi possível registrar o uso do documento agora.", usageError);
                });

                setMessage(msg, "Documento Word baixado com sucesso.", "success");
            }
        } catch (error) {
            console.error(error);
            setMessage(msg, translateError(error), "error");
        } finally {
            setFormLoading(form, false);
        }
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

    async function buildDocx(path, data) {
        const response = await fetch(path, { cache: "no-cache" });
        if (!response.ok) throw new Error(`Modelo não encontrado: ${path}`);

        const buffer = await response.arrayBuffer();
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
        const hasSingleTags = /(^|[^\{])\{\s*[a-zA-ZÀ-ÿ0-9_.-]+\s*\}([^\}]|$)/.test(allXml);

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
        const active = PDF_TOOLS[state.activePdfTool];
        refs.content.innerHTML = `
            <article class="glass-card">
                <h2>Ferramentas PDF</h2>
                <p>As ferramentas locais rodam no navegador. Compressão e OCR usam a rota original <code>/api/pdf-tools/process</code>.</p>
                <div class="chip-row">${Object.entries(PDF_TOOLS).map(([id, tool]) => `<button data-pdf-tool="${id}" class="${state.activePdfTool === id ? "is-active" : ""}">${escapeHtml(tool.title)}</button>`).join("")}</div>
            </article>
            <article class="glass-card">
                <span class="form-kicker">${active.server ? "API" : "Local"}</span>
                <h2>${escapeHtml(active.title)}</h2>
                <p>${escapeHtml(active.description)}</p>
                <form id="pdfToolForm" class="form-grid">
                    <label class="field wide"><span>Arquivos</span><input id="pdfFiles" type="file" accept="${escapeAttr(active.accept)}" ${active.multiple ? "multiple" : ""} required></label>
                    ${active.pages ? `<label class="field"><span>${escapeHtml(active.pages)}</span><input id="pdfPages" type="text" ${active.requiredPages ? "required" : ""}></label>` : ""}
                    ${active.rotation ? `<label class="field"><span>Rotação</span><select id="pdfRotation"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label>` : ""}
                    ${active.compression ? `<label class="field"><span>Nível</span><select id="pdfCompression"><option value="screen">Máxima</option><option value="balanced" selected>Equilibrada</option><option value="printer">Alta qualidade</option></select></label>` : ""}
                    ${active.ocr ? `<label class="field"><span>Idioma OCR</span><select id="pdfLanguage"><option value="por" selected>Português</option><option value="eng">Inglês</option><option value="spa">Espanhol</option></select></label>` : ""}
                    <div class="field wide"><p id="pdfMessage" class="message"></p></div>
                    <div class="field wide"><button class="primary-button" type="submit">Processar</button></div>
                </form>
            </article>
        `;
    }

    async function processPdfTool(event) {
        const form = event.target;
        const msg = $("#pdfMessage");
        const files = Array.from($("#pdfFiles").files || []);
        const pages = $("#pdfPages")?.value.trim() || "";
        const tool = PDF_TOOLS[state.activePdfTool];
        if (!files.length) return setMessage(msg, "Escolha ao menos um arquivo.", "error");
        setFormLoading(form, true);
        setMessage(msg, "Processando arquivo...", "");
        try {
            if (tool.server) {
                for (const [index, file] of files.entries()) {
                    setMessage(msg, `Enviando ${index + 1}/${files.length} para a API...`, "");
                    const data = await apiRequest("/api/pdf-tools/process", {
                        method: "POST",
                        body: {
                            toolType: state.activePdfTool,
                            fileName: file.name,
                            fileBase64: await blobToBase64(file, true),
                            options: { level: $("#pdfCompression")?.value || "balanced", language: $("#pdfLanguage")?.value || "por", pages },
                        },
                    });
                    if (data.pdfToolUsage) state.pdfToolUsage = data.pdfToolUsage;
                    downloadBase64(data.pdfBase64, data.fileName || `${state.activePdfTool}.pdf`, "application/pdf");
                }
                setMessage(msg, "Processamento concluído pela API.", "success");
            } else {
                await processPdfLocal(state.activePdfTool, files, pages);
                await apiRequest("/api/pdf-tools/usage", { method: "POST", body: { toolType: state.activePdfTool } }).then((r) => { if (r.pdfToolUsage) state.pdfToolUsage = r.pdfToolUsage; }).catch(() => {});
                setMessage(msg, "Arquivo preparado. Download iniciado.", "success");
            }
        } catch (error) {
            console.error(error);
            setMessage(msg, translateError(error), "error");
        } finally {
            setFormLoading(form, false);
        }
    }

    async function processPdfLocal(tool, files, pagesText) {
        if (!window.PDFLib) throw new Error("Biblioteca PDF não carregada.");
        const { PDFDocument, degrees, rgb, StandardFonts } = window.PDFLib;
        if (tool === "merge") {
            const out = await PDFDocument.create();
            for (const file of files) {
                const pdf = await PDFDocument.load(await file.arrayBuffer());
                const copied = await out.copyPages(pdf, pdf.getPageIndices());
                copied.forEach((p) => out.addPage(p));
            }
            return savePdf(out, "pdf-juntado.pdf");
        }
        if (["extract", "organize", "remove", "rotate", "split"].includes(tool)) {
            const src = await PDFDocument.load(await files[0].arrayBuffer());
            const total = src.getPageCount();
            let indexes = pagesText ? parsePages(pagesText, total) : src.getPageIndices();
            if (tool === "remove") indexes = src.getPageIndices().filter((i) => !indexes.includes(i));
            if (tool === "split") {
                for (const i of indexes) {
                    const out = await PDFDocument.create();
                    const [page] = await out.copyPages(src, [i]);
                    out.addPage(page);
                    await savePdf(out, `pagina-${i + 1}.pdf`);
                }
                return;
            }
            const out = await PDFDocument.create();
            const copied = await out.copyPages(src, indexes);
            copied.forEach((page) => {
                if (tool === "rotate") page.setRotation(degrees(Number($("#pdfRotation")?.value || 90)));
                out.addPage(page);
            });
            return savePdf(out, `${tool}.pdf`);
        }
        if (tool === "images") {
            const out = await PDFDocument.create();
            for (const file of files) {
                const bytes = await file.arrayBuffer();
                const img = file.type.includes("png") ? await out.embedPng(bytes) : await out.embedJpg(bytes);
                const page = out.addPage([img.width, img.height]);
                page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
            }
            return savePdf(out, "imagens.pdf");
        }
        if (tool === "wordPdf") {
            if (!window.mammoth) throw new Error("Biblioteca Word não carregada.");
            const text = (await window.mammoth.extractRawText({ arrayBuffer: await files[0].arrayBuffer() })).value || "Documento sem texto extraível.";
            const out = await PDFDocument.create();
            const font = await out.embedFont(StandardFonts.Helvetica);
            const lines = wrapText(text.replace(/\s+\n/g, "\n"), 92);
            let page = out.addPage([595, 842]);
            let y = 790;
            for (const line of lines) {
                if (y < 50) { page = out.addPage([595, 842]); y = 790; }
                page.drawText(line, { x: 42, y, size: 11, font, color: rgb(0.08, 0.12, 0.2) });
                y -= 16;
            }
            return savePdf(out, "word-convertido.pdf");
        }
    }

    function renderSupport() {
        refs.content.innerHTML = `
            <div class="split">
                <article class="glass-card">
                    <h2>Atendimento</h2>
                    <p>Envie mensagem ou comprovante para o administrador usando a rota original de suporte.</p>
                    <form id="supportForm" class="form-grid">
                        <label class="field"><span>Nome</span><input name="name" value="${escapeAttr(state.user?.name || "")}" ${state.user ? "readonly" : ""}></label>
                        <label class="field"><span>E-mail</span><input name="email" type="email" value="${escapeAttr(state.user?.email || "")}" ${state.user ? "readonly" : ""}></label>
                        <label class="field wide"><span>Mensagem</span><textarea name="message" required></textarea></label>
                        <label class="field wide"><span>Anexo opcional</span><input name="attachment" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"></label>
                        <div class="field wide"><p id="supportMessage" class="message"></p></div>
                        <div class="field wide"><button class="primary-button" type="submit">Enviar</button></div>
                    </form>
                </article>
                <article class="glass-card">
                    <h2>Histórico</h2>
                    <div class="action-row"><button class="secondary-button" data-load-support>Atualizar histórico</button></div>
                    <div id="supportList">${renderMessageList(state.supportMessages)}</div>
                </article>
            </div>
        `;
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

    function renderAI() {
        refs.content.innerHTML = `
            <article class="glass-card">
                <h2>IA DocSpace</h2>
                <p>Chat conectado às rotas originais <code>/api/ai/chat</code>, <code>/api/ai/conversations</code> e <code>/api/ai/usage</code>.</p>
                <div id="aiMessages" class="glass-card" style="box-shadow:none; min-height:220px; max-height:420px; overflow:auto"></div>
                <form id="aiForm" class="form-grid" style="margin-top:14px">
                    <label class="field wide"><span>Pergunta</span><textarea name="message" required placeholder="Ex.: explique este contrato..."></textarea></label>
                    <div class="field wide"><p id="aiMessage" class="message"></p></div>
                    <div class="field wide"><button class="primary-button" type="submit">Enviar para IA</button></div>
                </form>
            </article>`;
    }

    async function submitAI(event) {
        const form = event.target;
        const msg = $("#aiMessage");
        const box = $("#aiMessages");
        const message = new FormData(form).get("message");
        setFormLoading(form, true);
        setMessage(msg, "Consultando IA...", "");
        try {
            const data = await apiRequest("/api/ai/chat", { method: "POST", body: { message, conversationId: state.aiConversationId } });
            state.aiConversationId = data.conversationId || data.conversation?.id || state.aiConversationId;
            box.insertAdjacentHTML("beforeend", `<p><strong>Você:</strong> ${escapeHtml(message)}</p><p><strong>IA:</strong> ${escapeHtml(data.answer || data.message || "Resposta recebida.")}</p>`);
            form.reset();
            setMessage(msg, "", "");
        } catch (error) { setMessage(msg, translateError(error), "error"); }
        finally { setFormLoading(form, false); }
    }

    function renderBilling() {
        refs.content.innerHTML = `
            <article class="glass-card">
                <h2>Planos e renovação</h2>
                <p>Gere Pix integrado pelo Mercado Pago usando a API atual. O webhook renova o acesso automaticamente quando configurado.</p>
                <div class="grid">${PAYMENT_PLANS.map((plan) => `<article class="document-card"><h3>${escapeHtml(plan.label)}</h3><p>${escapeHtml(plan.price)}</p><button class="primary-button" data-create-pix="${plan.id}">Gerar Pix</button></article>`).join("")}</div>
                <div id="billingResult" class="qr-box" style="margin-top:18px"></div>
            </article>`;
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

    async function renderAdmin() {
        if (!isAdmin()) { refs.content.innerHTML = `<p class="message error">Apenas administradores.</p>`; return; }
        refs.content.innerHTML = `
            <div class="split">
                <article class="admin-card">
                    <h2>Criar / editar login</h2>
                    <form id="adminUserForm" class="form-grid">
                        <input type="hidden" name="uid" id="adminUid">
                        <label class="field"><span>Nome</span><input name="name" required></label>
                        <label class="field"><span>E-mail</span><input name="email" type="email" required></label>
                        <label class="field"><span>Senha</span><input name="password" type="password" placeholder="Preencha ao criar ou trocar"></label>
                        <label class="field"><span>Plano</span><select name="plan">${PLAN_OPTIONS.map((p) => `<option value="${p.id}">${escapeHtml(p.label)}</option>`).join("")}</select></label>
                        <label class="field"><span>Status</span><select name="status"><option value="active">Ativo</option><option value="blocked">Bloqueado</option><option value="expired">Expirado</option></select></label>
                        <label class="field"><span>Limite diário documentos</span><input name="dailyDocumentLimit" type="number" value="5" min="1"></label>
                        <label class="field"><span>PDF liberado?</span><select name="allowPdfTools"><option value="yes">Sim</option><option value="no">Não</option></select></label>
                        <label class="field"><span>Limite diário PDF</span><input name="pdfToolDailyLimit" type="number" value="5" min="1"></label>
                        <label class="field"><span>Verificado?</span><select name="isVerified"><option value="yes">Sim</option><option value="no">Não</option></select></label>
                        <label class="field"><span>Liquid Glass?</span><select name="allowLiquidGlass"><option value="no">Não</option><option value="yes">Sim</option></select></label>
                        <label class="field wide"><span>Observações</span><textarea name="notes"></textarea></label>
                        <div class="field wide"><p id="adminMessage" class="message"></p></div>
                        <div class="field wide action-row"><button class="primary-button" type="submit">Salvar login</button><button class="secondary-button" type="button" data-clear-admin-form>Limpar</button></div>
                    </form>
                </article>
                <article class="admin-card">
                    <h2>Usuários</h2>
                    <div class="action-row"><button class="secondary-button" data-load-admin>Atualizar</button><button class="secondary-button" data-load-admin-support>Atendimentos</button></div>
                    <div id="adminUsersArea">${renderAdminUsers()}</div>
                </article>
            </div>
            <div class="split">
                <article class="admin-card"><h2>Aviso de atualização</h2><form id="releaseForm" class="form-grid"><label class="field"><span>Versão</span><input name="versionName" placeholder="v1.0"></label><label class="field"><span>URL download</span><input name="downloadUrl" placeholder="https://..."></label><label class="field wide"><span>Mensagem</span><textarea name="message"></textarea></label><div class="field wide action-row"><button class="primary-button" type="submit">Publicar aviso</button><button class="secondary-button" type="button" data-delete-release>Remover aviso</button></div><p id="releaseMessage" class="message"></p></form></article>
                <article class="admin-card"><h2>Atendimentos</h2><div id="adminSupportArea">${renderMessageList(state.adminSupportMessages, true)}</div></article>
            </div>
        `;
        if (!state.adminUsers.length) loadAdminUsers().then(() => { if (state.view === "admin") renderAdmin(); }).catch(() => {});
    }

    function renderAdminUsers() {
        if (!state.adminUsers.length) return `<p class="message">Clique em atualizar para listar os usuários.</p>`;
        return `<div class="table-wrap"><table><thead><tr><th>Usuário</th><th>Plano</th><th>Status</th><th>Admin</th><th>Ações</th></tr></thead><tbody>${state.adminUsers.map((u) => `<tr><td><strong>${escapeHtml(u.name || "")}</strong><br><small>${escapeHtml(u.email || "")}</small></td><td>${escapeHtml(u.planLabel || u.plan || "")}</td><td>${escapeHtml(u.status || "")}</td><td>${u.isAdmin || u.is_admin ? "Sim" : "Não"}</td><td class="actions-cell"><button data-edit-user="${escapeAttr(u.id)}">Editar</button><button data-admin-action="${escapeAttr(u.id)}" data-action="${u.status === "blocked" ? "unblock" : "block"}">${u.status === "blocked" ? "Liberar" : "Bloquear"}</button><button data-admin-action="${escapeAttr(u.id)}" data-action="renewCurrent">Renovar</button><button data-user-history="${escapeAttr(u.id)}">Histórico</button></td></tr>`).join("")}</tbody></table></div>`;
    }

    async function loadAdminUsers() {
        const data = await apiRequest("/api/admin/users");
        state.adminUsers = data.users || [];
    }

    async function saveAdminUser(event) {
        const form = event.target;
        const msg = $("#adminMessage");
        const fd = new FormData(form);
        const uid = fd.get("uid");
        const body = {
            name: String(fd.get("name") || "").trim(),
            email: String(fd.get("email") || "").trim(),
            password: String(fd.get("password") || ""),
            plan: fd.get("plan"),
            status: fd.get("status"),
            dailyDocumentLimit: Number(fd.get("dailyDocumentLimit") || 5),
            dailyQuotaRenewalEnabled: true,
            allowPdfTools: fd.get("allowPdfTools") === "yes",
            pdfToolDailyLimit: Number(fd.get("pdfToolDailyLimit") || 5),
            pdfToolQuotaRenewalEnabled: true,
            isVerified: fd.get("isVerified") === "yes",
            allowLiquidGlass: fd.get("allowLiquidGlass") === "yes",
            allowedDocumentTypes: [],
            notes: String(fd.get("notes") || "").trim(),
            isAdmin: false,
        };
        if (uid && !body.password) delete body.password;
        setFormLoading(form, true);
        try {
            const data = uid ? await apiRequest(`/api/admin/users/${encodeURIComponent(uid)}`, { method: "PUT", body }) : await apiRequest("/api/admin/users", { method: "POST", body });
            setMessage(msg, data.message || "Login salvo.", "success");
            form.reset();
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
        const form = $("#adminUserForm");
        form.uid.value = user.id || "";
        form.name.value = user.name || "";
        form.email.value = user.email || "";
        form.plan.value = user.plan || "basic30";
        form.status.value = user.status || "active";
        form.dailyDocumentLimit.value = user.dailyDocumentLimit ?? user.daily_document_limit ?? 5;
        form.allowPdfTools.value = (user.allowPdfTools ?? user.allow_pdf_tools) ? "yes" : "no";
        form.pdfToolDailyLimit.value = user.pdfToolDailyLimit ?? user.pdf_tool_daily_limit ?? 5;
        form.isVerified.value = (user.isVerified ?? user.is_verified) ? "yes" : "no";
        form.allowLiquidGlass.value = (user.allowLiquidGlass ?? user.allow_liquid_glass) ? "yes" : "no";
        form.notes.value = user.notes || "";
        form.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    async function loadAdminSupport() {
        const data = await apiRequest("/api/admin/support/messages");
        state.adminSupportMessages = data.messages || [];
        renderAdmin();
    }

    async function publishRelease(event) {
        const msg = $("#releaseMessage");
        const fd = new FormData(event.target);
        try {
            const data = await apiRequest("/api/admin/app-release", { method: "POST", body: { versionName: fd.get("versionName"), downloadUrl: fd.get("downloadUrl"), message: fd.get("message") } });
            setMessage(msg, data.message || "Aviso publicado.", "success");
        } catch (error) { setMessage(msg, translateError(error), "error"); }
    }

    async function deleteRelease() {
        try { const data = await apiRequest("/api/admin/app-release", { method: "DELETE" }); toast(data.message || "Aviso removido.", "success"); } catch (error) { toast(translateError(error), "error"); }
    }

    function handleContentClick(event) {
        const nextStep = event.target.closest("[data-doc-step-next]");
        if (nextStep) { moveDocumentStep(nextStep.closest("form"), 1); return; }
        const prevStep = event.target.closest("[data-doc-step-prev]");
        if (prevStep) { moveDocumentStep(prevStep.closest("form"), -1); return; }
        const goto = event.target.closest("[data-goto]");
        if (goto) return navigate(goto.dataset.goto);
        const docOpen = event.target.closest("[data-doc-open]");
        if (docOpen) { state.activeDocId = docOpen.dataset.docOpen; renderDocuments(); setTimeout(() => $("#documentFormCard")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); return; }
        const closeDoc = event.target.closest("[data-close-doc]");
        if (closeDoc) { state.activeDocId = null; renderDocuments(); return; }
        const cat = event.target.closest("[data-category]");
        if (cat) { state.category = cat.dataset.category; renderDocuments(); return; }
        const pdfTool = event.target.closest("[data-pdf-tool]");
        if (pdfTool) { state.activePdfTool = pdfTool.dataset.pdfTool; renderPdfTools(); return; }
        const loadSupport = event.target.closest("[data-load-support]");
        if (loadSupport) { loadSupportMessages().then(renderSupport).catch((e) => toast(translateError(e), "error")); return; }
        const createPixBtn = event.target.closest("[data-create-pix]");
        if (createPixBtn) { createPix(createPixBtn.dataset.createPix); return; }
        const loadAdmin = event.target.closest("[data-load-admin]");
        if (loadAdmin) { loadAdminUsers().then(renderAdmin).catch((e) => toast(translateError(e), "error")); return; }
        const loadAdminSupport = event.target.closest("[data-load-admin-support]");
        if (loadAdminSupport) { loadAdminSupportMessages(); return; }
        const edit = event.target.closest("[data-edit-user]");
        if (edit) { editUser(edit.dataset.editUser); return; }
        const adminAction = event.target.closest("[data-admin-action]");
        if (adminAction) { runAdminAction(adminAction.dataset.adminAction, adminAction.dataset.action); return; }
        const clearAdmin = event.target.closest("[data-clear-admin-form]");
        if (clearAdmin) { $("#adminUserForm")?.reset(); $("#adminUid").value = ""; return; }
        const deleteRel = event.target.closest("[data-delete-release]");
        if (deleteRel) { deleteRelease(); return; }
        const historyBtn = event.target.closest("[data-user-history]");
        if (historyBtn) { showUserHistory(historyBtn.dataset.userHistory); return; }
    }

    async function loadAdminSupportMessages() { return loadAdminSupport(); }

    async function showUserHistory(uid) {
        try {
            const data = await apiRequest(`/api/admin/users/${encodeURIComponent(uid)}/history`);
            const history = data.history || [];
            toast(`Histórico: ${history.slice(0, 4).map((h) => h.action).join(", ") || "sem registros"}`);
        } catch (error) { toast(translateError(error), "error"); }
    }

    function handleContentSubmit(event) {
        if (event.target.id === "documentGenerateForm") { event.preventDefault(); generateDocument(event); }
        if (event.target.id === "pdfToolForm") { event.preventDefault(); processPdfTool(event); }
        if (event.target.id === "supportForm") { event.preventDefault(); submitSupport(event); }
        if (event.target.id === "adminUserForm") { event.preventDefault(); saveAdminUser(event); }
        if (event.target.id === "releaseForm") { event.preventDefault(); publishRelease(event); }
        if (event.target.id === "aiForm") { event.preventDefault(); submitAI(event); }
    }

    function handleContentInput(event) {
        if (event.target.id === "documentSearchZero") {
            state.query = event.target.value;
            const grid = event.target.closest(".content-area");
            renderDocuments();
            $("#documentSearchZero")?.focus();
        }
    }

    function handleContentChange(event) {
        const form = event.target?.closest?.("#documentGenerateForm");
        if (form) updateConditionalDocumentFields(form);
    }


    function moveDocumentStep(form, delta) {
        if (!form) return;
        const panels = $$('[data-step-panel]', form);
        if (!panels.length) return;
        const current = Number(form.dataset.currentStep || 0);
        const next = Math.max(0, Math.min(panels.length - 1, current + delta));
        if (next === current) return;
        form.dataset.currentStep = String(next);
        updateDocumentWizard(form);
        form.closest('#documentFormCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateDocumentWizard(form) {
        const current = Number(form.dataset.currentStep || 0);
        $$('[data-step-panel]', form).forEach((panel, index) => panel.classList.toggle('is-active', index === current));
        $$('[data-step-indicator]', form).forEach((item, index) => {
            item.classList.toggle('is-active', index === current);
            item.classList.toggle('is-done', index < current);
        });
        updateConditionalDocumentFields(form);
    }

    function countDocumentFields(doc) {
        return Number(doc.fields?.length || 0) + Number(doc.choices?.length || 0);
    }

    function buildDocumentSteps(doc) {
        const buckets = new Map();
        const order = [];
        const addStep = (key, title, description) => {
            if (!buckets.has(key)) {
                buckets.set(key, { key, title, description, items: [] });
                order.push(key);
            }
            return buckets.get(key);
        };

        if (doc.choices?.length) {
            const step = addStep('configuracao', 'Configuração do modelo', 'Escolha as opções que mudam o tipo de modelo antes de preencher os dados.');
            doc.choices.forEach((choice) => step.items.push({ kind: 'choice', choice }));
        }

        (doc.fields || []).forEach((field) => {
            const section = classifyDocumentField(field);
            const step = addStep(section.key, section.title, section.description);
            step.items.push({ kind: 'field', field });
        });

        addStep('revisao', 'Revisão e geração', 'Confira os dados preenchidos. Se estiver tudo certo, gere o Word ou o PDF protegido.');
        return order.map((key) => buckets.get(key)).filter(Boolean);
    }

    function classifyDocumentField(field) {
        const name = normalize(`${field.name || ''} ${field.label || ''}`);

        // Ordem importante: primeiro identifica pessoas específicas para não jogar localidade/endereço no grupo errado.
        if (hasAny(name, ['possui conjuge', 'possui obito', 'representacao'])) {
            return { key: 'configuracao', title: 'Configuração do modelo', description: 'Escolha as opções que mudam o modelo antes de preencher.' };
        }
        if (hasAny(name, ['comandante', 'contratante', 'declarante', 'pessoa', 'cliente']) && !hasAny(name, ['comandatario'])) {
            return { key: 'principal', title: 'Dados da pessoa principal', description: 'Preencha identificação, profissão, documentos e endereço da pessoa principal.' };
        }
        if (hasAny(name, ['comodatario', 'comandatario', 'arrendatario', 'comprador', 'vendedor', 'dependente', 'convivente', 'titular', 'beneficiario', 'responsavel'])) {
            return { key: 'segunda_parte', title: 'Outra parte do documento', description: 'Preencha os dados da outra pessoa envolvida no documento.' };
        }
        if (hasAny(name, ['conjuge', 'companheiro', 'falecimento', 'obito', 'falecido', 'representante'])) {
            return { key: 'familia_representacao', title: 'Cônjuge e representação', description: 'Preencha cônjuge, falecido, representante ou dados familiares quando o modelo pedir.' };
        }
        if (hasAny(name, ['imovel', 'propriedade', 'posse', 'terra', 'area', 'nirf', 'incra', 'matricula', 'gleba', 'perimetro', 'confrontante', 'confrontado', 'confrontacao', 'confrontacoes', 'norte', 'sul', 'leste', 'oeste', 'limite', 'divisa'])) {
            return { key: 'imovel', title: 'Imóvel, posse ou confrontantes', description: 'Informe localização, área, identificação do imóvel e confrontações.' };
        }
        if (hasAny(name, ['valor', 'pagamento', 'renda', 'produto', 'producao', 'rebanho', 'atividade', 'equipamento', 'veiculo', 'bem', 'marca', 'modelo', 'placa', 'prazo', 'duracao'])) {
            return { key: 'objeto_valores', title: 'Objeto, valores e condições', description: 'Informe bem, atividade, produção, valores, prazos ou condições econômicas.' };
        }
        if (hasAny(name, ['data', 'dia', 'mes', 'ano', 'cidade', 'uf', 'orgao', 'destino', 'finalidade', 'comarca', 'assinatura'])) {
            return { key: 'fechamento', title: 'Local, data e fechamento', description: 'Preencha datas, cidade, órgão de destino, finalidade e dados finais.' };
        }
        return { key: 'principal', title: 'Dados principais', description: 'Preencha os dados básicos exigidos pelo modelo.' };
    }

    function hasAny(text, terms) {
        return terms.some((term) => text.includes(term));
    }

    async function apiRequest(path, options = {}) {
        const headers = new Headers(options.headers || {});
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        const billingToken = localStorage.getItem(BILLING_TOKEN_KEY);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        if (billingToken) headers.set("X-Billing-Token", billingToken);
        const request = { method: options.method || "GET", headers, credentials: "include" };
        if (options.body !== undefined) {
            headers.set("Content-Type", "application/json");
            request.body = JSON.stringify(options.body);
        }
        const response = await fetch(`${API_BASE_URL}${path}`, request);
        const text = await response.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { message: text }; }
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
            const matchesCategory = state.category === "todos" || doc.category === state.category;
            const haystack = normalize(`${doc.title} ${doc.description} ${doc.id}`);
            return matchesCategory && (!query || haystack.includes(query));
        });
    }

    function getDocQuota(id) {
        if (!state.documentUsage || state.documentUsage.unlimited) return { remaining: "∞", blocked: false };
        const q = state.documentUsage.documents?.[id];
        const remaining = Number(q?.remaining ?? state.documentUsage.limit ?? 0);
        return { remaining, blocked: remaining <= 0 };
    }
    function getTotalRemainingDocuments() {
        if (!state.documentUsage || state.documentUsage.unlimited) return "∞";
        return Object.values(state.documentUsage.documents || {}).reduce((sum, item) => sum + Number(item.remaining || 0), 0);
    }
    function getTotalRemainingPdf() {
        if (!state.pdfToolUsage || state.pdfToolUsage.unlimited) return state.pdfToolUsage?.allowed === false ? 0 : "∞";
        return Object.values(state.pdfToolUsage.tools || {}).reduce((sum, item) => sum + Number(item.remaining || 0), 0);
    }
    function ensureDocumentAvailable(id) {
        const quota = getDocQuota(id);
        if (quota.blocked) throw new Error("Sem saldo disponível para este documento.");
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
        $$('button, input, textarea, select', form).forEach((el) => { if (el.type !== "hidden") el.disabled = loading; });
    }
    function setMessage(el, text, type) { if (el) { el.textContent = text || ""; el.className = `message ${type || ""}`.trim(); } }
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
    async function blobToBase64(blob, stripPrefix = false) {
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return stripPrefix ? String(dataUrl).replace(/^data:[^;]+;base64,/, "") : dataUrl;
    }
    function downloadBase64(base64, fileName, mime) {
        const clean = String(base64 || "").replace(/^data:[^;]+;base64,/, "");
        const bin = atob(clean);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        saveBlob(new Blob([bytes], { type: mime }), fileName);
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
    function inputModeFor(name) { const n = normalize(name); return n.includes("cpf") || n.includes("cnpj") || n.includes("ano") ? 'inputmode="numeric"' : ""; }
    function isLongField(name, label) { const n = normalize(`${name} ${label}`); return ["endereco","descricao","observacoes","confront","documentos","membros","atividade","produtos","benfeitorias","finalidade"].some((t) => n.includes(t)); }
    function chunkFields(fields, size) { const out = []; for (let i = 0; i < fields.length; i += size) out.push(fields.slice(i, i + size)); return out.length ? out : [[]]; }
    function categoryLabel(id) { return CATEGORIES.find((c) => c.id === id)?.label || "Documentos"; }
    function isAdmin() { return Boolean(state.user?.isAdmin || state.user?.is_admin); }
    function initials(value) { return String(value || "DS").split(/\s+|@/).filter(Boolean).slice(0,2).map((p) => p[0]?.toUpperCase()).join("") || "DS"; }
    function formatDate(value) { if (!value) return "Não informado"; const d = new Date(value); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString("pt-BR"); }
    function normalize(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
    function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
    function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
    function translateError(error) {
        const text = error?.data?.message || error?.message || "Erro inesperado.";
        if (/Failed to fetch|NetworkError/i.test(text)) return "Não foi possível conectar na API. Confira app-config.js e o Worker.";
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

# Kamba Serviços — MVP de demonstração

## Funcionalidades nesta versão
- Interface adaptável a telemóvel e computador.
- Cadastro de profissionais e pesquisa por serviço/localização.
- Formulário de pedido de serviço.
- Perfil público de demonstração e avaliações com nota/comentário.
- Painel local com pedidos, alteração de estado, remoção de perfil e exportação de dados.

## Limitação crítica
Os dados ficam apenas no navegador/dispositivo em que foram criados. Ainda não há contas, sincronização entre clientes, servidor, painel de administrador seguro, moderação central, notificações, pagamentos ou backup remoto. Não usar ainda para recolher dados reais sensíveis nem anunciar como serviço público operacional.

## Testar
Extrair o ZIP e abrir `index.html` num navegador moderno. Para servir localmente, correr `python -m http.server 8000` dentro da pasta e abrir `http://localhost:8000`.

## Arquitectura recomendada para produção
Frontend: React + TypeScript (ou modernizar este protótipo); backend: Supabase/PostgreSQL com Auth, Storage e políticas RLS; web: alojamento HTTPS; Android: empacotar a aplicação web com Capacitor e testar/assinar o pacote. O backend precisa de regras de acesso e nunca se devem expor chaves secretas no frontend.

## Próximas fases
1. Backend remoto e autenticação/verificação de contacto.
2. Tabelas para utilizadores, profissionais, categorias, pedidos, propostas, avaliações, denúncias e notificações.
3. Permissões e painel administrativo protegido.
4. Avaliações apenas ligadas a pedidos concluídos, moderação e auditoria.
5. Política de privacidade, termos, testes de segurança e acessibilidade.
6. Publicação web e Android.

Níveis gratuitos de fornecedores podem ter limites e mudar; domínio, SMS/WhatsApp API, utilização adicional e Google Play podem ter custos. Confirmar preços actuais antes de contratar.

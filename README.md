**Sistema de Assistência Técnica**

- Este sistema deve permitir o cadastro de tipos de serviço, como:
    - Manutenção;
    - Reparo;
    - Diagnóstico

Onde cada tipo possui um valor por hora ou valor fixo.

- A entidade principal será o registro de chamados, contendo informações como:
    - Cliente;
    - Descrição do problema;
    - Data e hora de abertura do atendimento;
    - Data e hora de conclusão do atendimento.

Cada chamado deve estar vinculado a um tipo de serviço.

- A regra de negócio consiste em calcular o tempo total de atendimento com base nas datas registradas e calcular o
valor final conforme o tipo de serviço escolhido.

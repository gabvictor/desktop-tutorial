const form = document.getElementById('dataForm');
const statusMessage = document.getElementById('statusMessage');

// Configurações do repositório GitHub
const GITHUB_TOKEN = "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"; // Substitua pelo seu token pessoal
const GITHUB_OWNER = "gabvictor";   // Substitua pelo seu nome de usuário ou organização
const GITHUB_REPO = "desktop-tutorial"; // Substitua pelo nome do repositório
const GITHUB_FILE_PATH = "dados/formulario.json"; // Caminho do arquivo onde os dados serão armazenados

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    try {
        // Obter o conteúdo atual do arquivo
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });

        let fileContent = [];
        let sha = null;

        if (response.ok) {
            const fileData = await response.json();
            fileContent = JSON.parse(atob(fileData.content)); // Decodificar conteúdo do arquivo
            sha = fileData.sha; // Obter o SHA do arquivo existente
        }

        fileContent.push(formData); // Adicionar novo dado ao conteúdo existente

        // Atualizar ou criar o arquivo no repositório
        const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Novo envio de formulário",
                content: btoa(JSON.stringify(fileContent, null, 2)), // Codificar em Base64
                sha // Adicionar o SHA para atualizações
            })
        });

        if (updateResponse.ok) {
            statusMessage.textContent = "Dados enviados com sucesso!";
            form.reset();
        } else {
            const error = await updateResponse.json();
            throw new Error(error.message);
        }
    } catch (error) {
        statusMessage.textContent = `Erro: ${error.message}`;
    }
});

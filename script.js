// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAa0nH3Qyd-E0INtQLR4vabbKV30rrQTus",
    authDomain: "agenda-consulta-2fd3c.firebaseapp.com",
    databaseURL: "https://agenda-consulta-2fd3c-default-rtdb.firebaseio.com",
    projectId: "agenda-consulta-2fd3c",
    storageBucket: "agenda-consulta-2fd3c.appspot.com",
    messagingSenderId: "39300096902",
    appId: "1:39300096902:web:759f58f5efd1f601dcc207",
    measurementId: "G-4VT343DLC0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

// Password for accessing the site
var correctPassword = "1234*"; // Troque pela sua senha

// Show the password modal on page load
document.getElementById('password-modal').style.display = 'block';

function checkPassword() {
    var enteredPassword = document.getElementById('accessPassword').value;
    if (enteredPassword === correctPassword) {
        document.getElementById('password-modal').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        // Show the site content
        document.body.style.display = 'block';
        // Exibe consultas existentes ao carregar a página
        exibirConsultas();
    } else {
        alert('Senha incorreta. Tente novamente.');
    }
}

function criarBotaoRemover(key) {
    var button = document.createElement('button');
    button.textContent = 'Remover';
    button.addEventListener('click', function() {
        removerConsulta(key);
    });
    return button;
}

function agendarConsulta() {
    var usuario = document.getElementById('usuario').value;
    var data = document.getElementById('data').value;
    var horario = document.getElementById('horario').value;
    var nomeMedico = document.getElementById('nomeMedico').value;

    var appointmentData = {
        usuario: usuario,
        data: data,
        horario: horario,
        nomeMedico: nomeMedico
    };

    // Adiciona dados ao Firebase Realtime Database
    var appointmentsRef = database.ref('consultas');
    var newAppointmentRef = appointmentsRef.push(appointmentData);

    // Obtemos a chave (key) gerada para a nova consulta
    var appointmentKey = newAppointmentRef.key;

    // Atualiza a exibição
    exibirConsultas();
}

function removerConsulta(key) {
    // Pede uma confirmação antes de remover a consulta
    var confirmacao = confirm('Deseja realmente remover esta consulta?');

    if (confirmacao) {
        var appointmentsRef = database.ref('consultas');
        appointmentsRef.child(key).remove();

        // Atualiza a exibição
        exibirConsultas();
    }
}

function formatarData(data) {
    var partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0].slice(-4);
}

function exibirConsultas() {
    var appointmentsRef = database.ref('consultas');
    var container = document.getElementById('appointment-container');
    container.innerHTML = '';

    appointmentsRef.orderByChild('data').once('value', function(snapshot) {
        var consultas = [];
        snapshot.forEach(function(childSnapshot) {
            var appointment = childSnapshot.val();
            var key = childSnapshot.key; // Chave da consulta
            consultas.push({ key, appointment });
        });

        // Ordena as consultas com base na data
        consultas.sort(function(a, b) {
            return new Date(a.appointment.data + ' ' + a.appointment.horario) - new Date(b.appointment.data + ' ' + b.appointment.horario);
        });

        // Exibe as consultas ordenadas
        consultas.forEach(function(consulta) {
            var card = document.createElement('div');
            card.className = 'appointment-card';
            card.innerHTML = `
                <p><strong>Usuário:</strong> ${consulta.appointment.usuario}</p>
                <p><strong>Data:</strong> ${formatarData(consulta.appointment.data)}</p>
                <p><strong>Horário:</strong> ${consulta.appointment.horario}</p>
                <p><strong>Médico:</strong> ${consulta.appointment.nomeMedico}</p>
            `;
            var removeButton = criarBotaoRemover(consulta.key);
            card.appendChild(removeButton);
            container.appendChild(card);
        });
    });
}


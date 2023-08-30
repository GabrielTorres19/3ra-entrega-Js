document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = 'https://v6.exchangerate-api.com/v6/cd149818b2da544186564ed1/latest/ARS';
//------------- Obtener elementos del DOM----------------
  const loginSection = document.getElementById('loginSection');
  const calculatorSection = document.getElementById('calculatorSection');
  const loginButton = document.getElementById('loginButton');
  const cotizadorButton = document.getElementById('cotizador');
  const resultadosDiv = document.getElementById('resultados');
  const currencySelect = document.getElementById('currencySelect');

  const resultadosConversion = [];

//-------------- Evento para el botón de inicio de sesión------
loginButton.addEventListener('click', function() {
  const username = document.getElementById('username').value;
  if (username) {
//-------------- Mostrar SweetAlert de bienvenida------------
    Swal.fire({
      title: '¡Bienvenido!',
      text: `Hola, ${username}!`,
      icon: 'success',
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        loginSection.style.display = 'none';
        calculatorSection.style.display = 'block';
      }
    });
  }
});

  //------------- Evento para el botón de cotización--------------
  cotizadorButton.addEventListener('click', function() {
    convertir();
  });

//------Función para realizar la conversión de divisas------
async function convertir() {
  const valor = parseFloat(document.getElementById("valor").value);
  const selectedCurrency = currencySelect.value;

  try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();

      if (data.conversion_rates && data.conversion_rates[selectedCurrency]) {
          const conversionRate = data.conversion_rates[selectedCurrency];
          const resultado = (valor * conversionRate).toFixed(2);
          const formattedResult = selectedCurrency === 'USD' ? `$${resultado}` : `${selectedCurrency} ${resultado}`;
          resultadosConversion.push(formattedResult);

          localStorage.setItem('resultadosConversion', JSON.stringify(resultadosConversion));
          showLatestResults();
      } else {
          alert("No se encontró tasa de cambio para la moneda seleccionada");
      }
  } catch (error) {
      console.error("Error al obtener tasas de cambio:", error);
      alert("Hubo un error al obtener tasas de cambio. Por favor, inténtalo más tarde.");
  }
}


//------- Función para mostrar los últimos resultados almacenados----------------
  function showLatestResults() {
    const storedResultadosConversion = JSON.parse(localStorage.getItem('resultadosConversion')) || [];
    const lastTwoResults = storedResultadosConversion.slice(-2);

    resultadosDiv.innerHTML = "<p>Últimos 2 resultados de cotizaciones:</p>" + lastTwoResults.join(', ');
  }

//-------------Mostrar resultados almacenados al cargar la página----------------------
  showLatestResults();
});
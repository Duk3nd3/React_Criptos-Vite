import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Spinner from './components/Spinner';
import ImagenCripto from './img/imagen-criptos.png';
import Formulario from './components/Formulario';
import Cotizacion from './components/Cotizacion';

//Styled Components
const Contenedor = styled.div`
	max-width: 900px;
	margin: 0 auto;
	width: 90%;
	@media (min-width: 992px) {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: 2rem;
	}
`;

//Styled Components
const Imagen = styled.img`
	max-width: 400px;
	width: 80%;
	margin: 100px auto 0 auto;
	display: block;
`;

//Styled Components
const Heading = styled.h1`
	font-family: 'Latom sans-serif';
	color: #fff;
	text-align: center;
	font-weight: 700;
	margin-top: 80px;
	margin-bottom: 50px;
	font-size: 34px;

	&::after {
		content: '';
		width: 100px;
		height: 6px;
		background-color: #66a2fe;
		display: block;
		margin: 10px auto 0 auto;
	}
`;

function App() {
	const [monedas, setMonedas] = useState({});
	const [resultado, setResultado] = useState({});
	const [cargando, setCargando] = useState(false);

	//Con el hook useEffecto volvemos a llamar a la API para obtener los datos seleccionados por el usuario
	useEffect(() => {
		if (Object.keys(monedas).length > 0) {
			const cotizarCripto = async () => {
				//Spinning para la carga durante la consulta a la API
				setCargando(true);
				//Limpiamos el resultado previo
				setResultado({});

				//Desestructuramos el objeto moneda para utilizar sus variables dentro de la url de la API
				const { moneda, criptomoneda } = monedas;

				const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

				const respuesta = await fetch(url);
				const resultado = await respuesta.json();

				setResultado(resultado.DISPLAY[criptomoneda][moneda]);

				//Fin spinning
				setCargando(false);
			};
			cotizarCripto();
		}
	}, [monedas]);

	return (
		<Contenedor>
			<Imagen src={ImagenCripto} alt='imagenes criptomonedas' />
			<div>
				<Heading>Cotiza Criptomonedas al Instante</Heading>
				<Formulario setMonedas={setMonedas} />

				{cargando && <Spinner />}
				{resultado.PRICE && <Cotizacion resultado={resultado} />}
			</div>
		</Contenedor>
	);
}

export default App;

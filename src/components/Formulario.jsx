import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Error from './Error';
import useSelectMonedas from '../hooks/useSelectMonedas';
import { monedas } from '../data/monedas';

const InputSubmit = styled.input`
	background-color: #9497ff;
	border: none;
	width: 100%;
	padding: 10px;
	margin-top: 30px;
	color: #fff;
	font-weight: 700;
	text-transform: uppercase;
	font-size: 20px;
	border-radius: 5px;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #7a7dfe;
		cursor: pointer;
	}
`;

const Formulario = ({ setMonedas }) => {
	const [criptos, setCriptos] = useState([]);
	const [error, setError] = useState(false);

	//Obtenemos el listado de moneda extranjera desde la fake api
	const [moneda, SelectMonedas] = useSelectMonedas('Elige tu Moneda', monedas);
	//Obtenemos el estado de criptos desde la API
	const [criptomoneda, SelectCriptomoneda] = useSelectMonedas(
		'Elige tu Criptomoneda',
		criptos
	);

	useEffect(() => {
		const consultarAPI = async () => {
			const url =
				'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
			const respuesta = await fetch(url);
			const resultado = await respuesta.json();

			//Aqui mapeamos la informacion obtenida de la API
			const arrayCriptos = resultado.Data.map((cripto) => {
				const objeto = {
					id: cripto.CoinInfo.Name,
					nombre: cripto.CoinInfo.FullName,
				};

				//Sino devolvemos el 'objeto' con los datos obtenidos de la API, arrayCriptos nos mostrada undefined
				return objeto;
			});

			//Con el hook useState setCriptos manejamos la informacion obtenida de la API con el mapeo
			setCriptos(arrayCriptos);
		};
		consultarAPI();
	}, []);

	//Aqui manejamos el estado del boton SUBMIT y hacemos una validacion sobre los campos a seleccionar
	const handleSubmit = (e) => {
		e.preventDefault();

		if ([moneda, criptomoneda].includes('')) {
			setError(true);
			return;
		}
		//Si se cumple la condicion, quitamos el mensaje de error cambiando el estado de setError a false
		setError(false);

		//Despues de pasar la validacion, obtenemos la seleccion realizada por el usuario, llenamos el objeto
		setMonedas({ moneda, criptomoneda });
	};

	return (
		<>
			{error && <Error>Todos los campos son obligatorios</Error>}
			<form onSubmit={handleSubmit}>
				<SelectMonedas />
				<SelectCriptomoneda />

				<InputSubmit type='submit' value='Cotizar' />
			</form>
		</>
	);
};

export default Formulario;

/*
Alisson Mateus de Oliveira Magalhães	NºUSP: 8066287
Creunivar Toledo de Abreu				NºUSP: 3460973
Fábio Alves Martins Pereira			 NºUSP: 7987435
Rafael Silva de Milhã					NºUSP: 8139701
*/

function login(){
	password = document.getElementById('password').value;
	email = document.getElementById('email').value;

	let active = dataBase.result;
	let transaction = active.transaction(["cliente"], "readonly");
	let objectStore = transaction.objectStore("cliente");
	let index = objectStore.index("email");
	let request = index.get(email);
			
	request.onsuccess = function () {
		if (request.result !== undefined) {
			if(request.result.password !== password)
				alert("Senha errada!");
			else{
				document.cookie = "userid="+request.result.id;
				window.location.assign("index.html");
			}
		} else {
			let transaction2 = active.transaction(["adm"], "readonly");
			let objectStore2 = transaction2.objectStore("adm");
			let index2 = objectStore2.index("email");
			let request2 = index2.get(email);

			request2.onsuccess = function () {
				if (request2.result !== undefined) {
					if(request2.result.password !== password)
						alert("Senha errada!");
					else
						window.location.assign("index-admin.html");
				} else
					alert("E-mail não encontrado!");
			};
		}
	};

	request.onerror = function (e) {
		console.log(request.error.name + '\n\n' + request.error.message);
	};
}

menu = () => {
	let outerHTML = '';
	if(document.cookie.split("=")[1] == "client"){
		outerHTML = '<a href="index.html"><img id="petshop-logo" src="../images/petshop-logo-half-white.png" alt="Logo Petshop"/></a>\n\
					<ul>\n\
						<li><a href="listar-produtos.html">Produtos</a></li>\n\
						<li><a href="servico.html">Serviços</a></li>\n\
						<li><a href="">Animais</a>\n\
							<ul>\n\
								<li><a href="cadastrar-animal.html">Cadastrar</a></li>\n\
								<li><a href="listar-animal.html">Editar Dados</a></li>\n\
							</ul>\n\
						</li>\n\
						<li><a href="">Dados Pessoais</a>\n\
							<ul>\n\
								<li><a href="editar-dados-pessoais.html">Editar</a></li>\n\
								<li><a href="editar-endereco.html">Endereço</a></li>\n\
								<li><a href="editar-senha.html">Alterar Senha</a></li>\n\
							</ul>\n\
						</li>\n\
					</ul>\n\
					<form class="login-form" action="/amicao_db/logout" method="POST">\n\
						<input class="login-input login-button" type="submit" value="Sair"/>\n\
					</form>\n\
					<a href="carrinho.html"><img id="shop-cart" src="../images/shopping-cart.png" alt="Carrinho de Compras"/></a>';
		document.getElementById('menu').innerHTML = outerHTML;
	} else {
		outerHTML = '<a href="index.html"><img id="petshop-logo" src="../images/petshop-logo-half-white.png" alt="Logo Petshop"/></a>\n\
					<ul>\n\
						<li><a href="listar-produtos.html">Produtos</a></li>\n\
						<li><a href="servico.html">Serviços</a></li>\n\
					</ul>\n\
					<form class="login-form" action="/amicao_db/login" method="POST">\n\
						<input class="login-input" type="email" name="email" placeholder="E-mail"/>\n\
						<input class="login-input" type="password" name="password" placeholder="Senha"/>\n\
						<input class="login-input login-button" type="submit" value="Entrar"/>\n\
					</form>';
		document.getElementById('menu').innerHTML = outerHTML;
 	}
}

function prodList(){
	let active = dataBase.result;
	let transaction = active.transaction(["produto"], "readonly");
	let objectStore = transaction.objectStore("produto");

	let produtos = [];

	objectStore.openCursor().onsuccess = function (e) {
		let result = e.target.result;
		if (result === null) {
			return;
		}
		produtos.push(result.value);
		result.continue();
	};

	transaction.oncomplete = function() {
		let outerHTML = '';
		for (let key in produtos) {
			outerHTML += '\n\
							<section class="image-container">\n\
								<a href="detalhes-produto.html">\n\
									<img class="foto" src="..\\images\\' + produtos[key].foto.split("\\").slice(-1)[0] + '">\n\
									<p>' + produtos[key].name + '</p>\n\
								</a>\n\
							</section>';
		}
		produtos = [];
		document.getElementById("prodList").innerHTML = '<h1>Produtos</h1>' + outerHTML;
	};
}

function servList(){
	let active = dataBase.result;
	let transaction = active.transaction(["servico"], "readonly");
	let objectStore = transaction.objectStore("servico");

	let servicos = [];

	objectStore.openCursor().onsuccess = function (e) {
		let result = e.target.result;
		if (result === null) {
			return;
		}
		servicos.push(result.value);
		result.continue();
	};

	transaction.oncomplete = function() {
		let outerHTML = '';
		for (let key in servicos) {
			outerHTML += '\n\
							<section class="image-container">\n\
								<a href="reservar-horario.html">\n\
									<img class="list-image" src="..\\images\\' + servicos[key].foto.split("\\").slice(-1)[0] + '" alt="Mr. Schwibbles">\n\
								</a>\n\
								<p class="price">' + servicos[key].name + '</p>\n\
								<p class="price">Preço: <span style="color:black">' + servicos[key].price + '</span></p>\n\
							</section>';
		}
		servicos = [];
		document.getElementById("servList").innerHTML = '<h1>Serviços Disponíveis</h1>' + outerHTML;
	};
}

function animalList(){
	let active = dataBase.result;
	let transaction = active.transaction(["animal"], "readonly");
	let objectStore = transaction.objectStore("animal");

	let animais = [];

	objectStore.openCursor().onsuccess = function (e) {
		let result = e.target.result;
		if (result === null) {
			return;
		}
		animais.push(result.value);
		result.continue();
	};

	transaction.oncomplete = function() {
		let outerHTML = '';
		for (let key in animais) {
			if(getUserId() == animais[key].idOwner){
				outerHTML += '\n\
								<section class="image-container">\n\
									<a href="editar-animal.html">\n\
										<img class="list-image" src="..\\images\\' + animais[key].foto.split("\\").slice(-1)[0] + '" alt="Mr. Schwibbles">\n\
										<p>' + animais[key].name + '</p>\n\
									</a>\n\
								</section>';
			}
		}
		animais = [];
		document.getElementById("animalList").innerHTML = '<h1>Animais</h1>' + outerHTML;

	};
}

function cadastrarAnimal(){
	name = document.getElementById('name').value;
	raca = document.getElementById('raca').value;
	idade = document.getElementById('idade').value;
	foto = document.getElementById('foto').value;
	if(name && raca && idade && foto){
		animal = {idOwner: getUserId(), name: name, raca: raca, idade: idade, foto: foto};
		add(animal,"animal");
		document.getElementById('name').value = "";
		document.getElementById('raca').value = "";
		document.getElementById('idade').value = "";
		document.getElementById('foto').value = "";
	}
}

function editarEndereco(){
	cep = document.getElementById('cep').value;
	cidade = document.getElementById('cidade').value;
	estado = document.getElementById('estado').value;
	bairro = document.getElementById('bairro').value;
	rua = document.getElementById('rua').value;
	numero = document.getElementById('numero').value;
	complemento = document.getElementById('complemento').value;
	referencia = document.getElementById('referencia').value;
	if(cep && cidade && estado && bairro && rua && numero){
		endereco = {idCliente: getUserId(), cep: cep, cidade: cidade, estado: estado, bairro: bairro, rua: rua, numero: numero, complemento: complemento, referencia: referencia};
		request = dataBase.result.transaction(["endereco"], "readonly").objectStore("endereco").index("idCliente").get(getUserId());
		request.onsuccess = function () {
			request1 = dataBase.result.transaction(["endereco"], "readwrite").objectStore("endereco").delete(request.result.id);
		}
		add(endereco,"endereco");
		document.getElementById('cep').value = "";
		document.getElementById('cidade').value = "";
		document.getElementById('estado').value = "";
		document.getElementById('bairro').value = "";
		document.getElementById('rua').value = "";
		document.getElementById('numero').value = "";
		document.getElementById('complemento').value = "";
		document.getElementById('referencia').value = "";
	}
	window.location.assign("editar-endereco.html");
}

function getEndereco(){
	let request = dataBase.result.transaction(["endereco"], "readonly").objectStore("endereco").index("idCliente").get(getUserId());

	request.onsuccess = function () {
		if (request.result !== undefined) {
			document.getElementById('cep').value = request.result.cep;
			document.getElementById('cidade').value = request.result.cidade;
			document.getElementById('estado').value = request.result.estado;
			document.getElementById('bairro').value = request.result.bairro;
			document.getElementById('rua').value = request.result.rua;
			document.getElementById('numero').value = request.result.numero;
			document.getElementById('complemento').value = request.result.complemento;
			document.getElementById('referencia').value = request.result.referencia;
		}
	}
}
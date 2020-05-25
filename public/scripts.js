const currentPage = location.pathname //localizando a página em que estou

//pegando os itens do menu
const menuItems = document.querySelectorAll("header .links a") 

//este for percorre os links do menu e se a localização em que estivermos for igual a do href, ele adiciona uma class active que muda o css do link
for (item of menuItems) {
   if(currentPage.includes(item.getAttribute("href"))) {
      item.classList .add("active") 
   }
}



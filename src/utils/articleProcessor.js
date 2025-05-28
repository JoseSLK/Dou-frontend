import DOMPurify from 'dompurify';

// Esta funcion recibe la lista de articulos (n articulos)
// Recorre uno a uno y extrae el titulo
// Luego va agregando a una nueva lista de articulos, articulos
// con estructura title, material_id, description_path
function articleProcessor( list ) {
    let articles = [];
    for( let i = 0; i < list.length; i++ ){
        let article = list[i];
        let title = extractTitle( article.description_path );
        let material_id = parseInt(article.material_id);
        let description_path = cleanHtml(article.description_path);
        articles.push({
            title,
            material_id,
            description_path
        });
    }
    return articles;
}

// Esta funcion recibe un articulo (texto con etiquetas html) y extrae
// el titulo del articulo. Busca la etiqueta <h1> y retorna el texto
// que esta dentro de esta etiqueta. Si no encuentra la etiqueta <h1>
// retorna un string vacio.
// La funcion debe retornar un string con el titulo del articulo
// y sin etiqueta
function extractTitle(article) {
    const match = article.match(/<h[12][^>]*>(.*?)<\/h[12]>/i);
    return match ? match[1].trim() : '';
}


// Esta funcion recibe un articulo (texto con etiquetas html) y usando
// DOMPurify, limpia el html y retorna el texto solo con etiquetas permitidas
function cleanHtml ( article ) {
    const htmlLimpio = DOMPurify.sanitize(article, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: ['article','header','section','pre','p', 'b', 'i', 'u', 'strong', 'em', 'br', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'], 
        ALLOWED_ATTR: ['href', 'target', 'rel']
    });
    return htmlLimpio;
}

export default articleProcessor;

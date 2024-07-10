import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery'
import 'bootstrap'

const createCollectionsOutput = (data) => {
    const collectionsDiv = document.getElementById('collections');
    collectionsDiv.innerHTML = ''; // Clear the div

    // Create a new ul element with Bootstrap classes
    const ul = document.createElement('ul');
    ul.className = 'list-group';

    data.forEach(item => {
        // Create a new li element with Bootstrap classes
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action';

        // Create a new a element
        const a = document.createElement('a');
        a.href = "http://localhost:3000/run/"+item; // Assuming the item has a url property
        a.textContent = item; // Assuming the item has a name property

        // Append the a element to the li element
        li.appendChild(a);

        // Append the li element to the ul element
        ul.appendChild(li);
    });

    // Append the ul element to the collectionsDiv
    collectionsDiv.appendChild(ul);
}

function loadCollections() {
    fetch('http://localhost:3000/collections')
        .then(response => response.json())
        .then(data => {
            createCollectionsOutput(data)
        })
        .catch(error => console.error('Error:', error));
}

$(document).ready(function () {
    $('#load-collections').on('click', loadCollections);
    loadCollections();
})

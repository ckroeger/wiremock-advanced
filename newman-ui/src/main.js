import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery'
import 'bootstrap'

const createCollectionsOutput = (data) => {
    const collectionsDiv = document.getElementById('collections');
    // if collectionsDiv contauins ul element set timeout to 2100ms
    const timeOut = collectionsDiv.querySelector('ul') ? 2100 : 0;
    setTimeout(() => {
        collectionsDiv.innerHTML = ''; // Clear the div
        const ul = document.createElement('ul');
        ul.className = 'list-group';

        data.forEach(item => {
            // Create a new li element with Bootstrap classes
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action';

            // Create a new a element
            const a = document.createElement('a');
            a.href = "http://localhost:3000/run/"+item;
            a.textContent = item;
            // Append the a element to the li element
            li.appendChild(a);

            // Append the li element to the ul element
            ul.appendChild(li);
        });

        // Append the ul element to the collectionsDiv
        collectionsDiv.appendChild(ul);

    }, timeOut);
}

function loadCollections() {
    const collectionsDiv = document.getElementById('collections');
    // if collectionsDiv contauins ul element, add blur-effect class on each ul element
    if (collectionsDiv.querySelector('li')) {
        collectionsDiv.querySelectorAll('li').forEach(ul => {
            ul.classList.add('blur-effect');
        });
    }

    fetch('http://localhost:3000/collections')
        .then(response => response.json())
        .then(data => {
            createCollectionsOutput(data);
            // Remove the blur effect from each ul element
            document.querySelectorAll('.list-group').forEach(ul => {
                ul.classList.remove('blur-effect');
            });
        })
        .catch(error => console.error('Error:', error));
}

$(document).ready(function () {
    $('#load-collections').on('click', loadCollections);
    loadCollections();
})

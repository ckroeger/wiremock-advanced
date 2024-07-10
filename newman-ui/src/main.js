import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery'
import 'bootstrap'

$(document).ready(function() {
    $('#clickMe').on('click', function() {
        alert('HI! Youve clicked me!')
    })
})

var items = [];
const rowDelete = "<td class='text-right'><button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button></td>";

$('#addItem').click(function(){
    var str = $('#item').val();
    var num = items.length + 1;
    var dict = {
        num: num,
        name: str,
        quantity: 1,
        price: 10
    }
    items.push(dict);

    $('#myTable tr:last').after("<tr><td>"+num+"</td><td>"+str+"</td><td>1</td><td>10</td><td>10</td>"+rowDelete+"</tr>");
});

$('#myTable').on('click', 'button.close', function(e){
    e.preventDefault();
    var nRow = $(this).parents('tr')[0];
    $(nRow).remove();
})
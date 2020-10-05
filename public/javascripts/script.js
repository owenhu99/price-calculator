var items = [];

const rowDelete = "<td class='text-right'><button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button></td>";

$('#addItem').click(function(){
    var str = $('#item').val();
    var num = items.length + 1;
    var dict = {
        name: str,
        quantity: 1,
        price: 10
    };
    items.push(dict);

    $('#myTable tr:last').after("<tr><td>"+str+"</td><td>1</td><td>10</td><td>10</td>"+rowDelete+"</tr>");
    $('#total').text("Total $" + getSum());
});

$('#myTable').on('click', 'button.close', function(e){
    e.preventDefault();
    var nRow = $(this).parents('tr')[0];
    $(nRow).remove();
    items.splice(nRow.rowIndex - 1, 1);
    $('#total').text("Total $" + getSum());
})

function getSum() {
    var sum = 0;
    for (var i = 0; i < items.length; i++) {
        sum += items[i].quantity * items[i].price;
    }
    return sum.toFixed(2);
}
var items = [];
var discount = 0;
var tax = 13; // default 13%

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

    $.ajax({
        url: '/search',
        type: 'POST',
        cache: false,
        data: { value: $('#item').serialize() },
        dataType: 'json',
        success: function (data) {
            alert(data.test);
        },
        error: function (jqXHR, textStatus, err) {
            alert('text status ' + textStatus + ', err ' + err);
        }
    });

    $('#myTable tr:last').after("<tr><td>"+str+"</td><td>1</td><td>10</td><td>10</td>"+rowDelete+"</tr>");
    var sum = getSum();
    $('#total').html("Discount -$"+ sum[0] +" &emsp; Tax $"+sum[1]+" &emsp; <b>Total $"+sum[2]+"</b>");
});

$('#myTable').on('click', 'button.close', function(e){
    e.preventDefault();
    var nRow = $(this).parents('tr')[0];
    $(nRow).remove();
    items.splice(nRow.rowIndex - 1, 1);
    var sum = getSum();
    $('#total').html("Discount -$"+ sum[0] +" &emsp; Tax $"+sum[1]+" &emsp; <b>Total $"+sum[2]+"</b>");
});

function getSum() {
    var sum = 0;
    for (var i = 0; i < items.length; i++) {
        sum += items[i].quantity * items[i].price;
    };
    var discountTotal = sum * (discount / 100);
    var taxTotal = sum * (tax / 100);
    if (discount) {
        sum = sum * (1 + (tax / 100)) * (1 - (discount / 100));
    } else {
        sum = sum * (1 + (tax / 100));
    }
    return [discountTotal.toFixed(2), taxTotal.toFixed(2), sum.toFixed(2)];
}

$('#applyTax').click(function(){
    var newTax = $('#tax').val();
    if (newTax != "") {
        tax = newTax;
    }
    $('#modalTaxRate').modal('hide');
    var sum = getSum();
    $('#total').html("Discount -$"+ sum[0] +" &emsp; Tax $"+sum[1]+" &emsp; <b>Total $"+sum[2]+"</b>");
});

$('#applyDiscount').click(function(){
    var newDiscount = $('#discount').val();
    if (newDiscount != "") {
        discount = newDiscount;
    }
    $('#modalDiscount').modal('hide');
    var sum = getSum();
    $('#total').html("Discount -$"+ sum[0] +" &emsp; Tax $"+sum[1]+" &emsp; <b>Total $"+sum[2]+"</b>");
});
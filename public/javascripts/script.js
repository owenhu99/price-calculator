var items = [];
var discount = 0;
var tax = 13; // default 13%

const rowDelete = "<td class='text-right'><button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button></td>";

$('#addItem').click(function(){
    var upc = $('#item').val();

    $.ajax({
        url: '/search',
        type: 'POST',
        cache: false,
        data: { value: upc },
        dataType: 'json',
        success: function (data) {
            onSuccess(data);
        },
        error: function (jqXHR, textStatus, err) {
            alert('text status ' + textStatus + ', err ' + err);
        }
    });
});

$('#myTable').on('click', 'button.close', function(e){
    e.preventDefault();
    var nRow = $(this).parents('tr')[0];
    if (!deleteItem($(nRow).attr('id'))) {
        alert("Could not find item with corresponding UPC. Please report to admin.");
    };
    $(nRow).remove();
    var sum = getSum();
    $('#total').html("Discount -$"+ sum[0] +" &emsp; Tax $"+sum[1]+" &emsp; <b>Total $"+sum[2]+"</b>");
});

function deleteItem(id) {
    var upc = parseInt(id.substring(1));
    for (var i = 0; i < items.length; i++) {
        if (items[i].upc == upc) {
            items.splice(i, 1);
            return(1);
        }
    }
    return(0);
}

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

function onSuccess (result) {
    alert(result.name);

    if (!result.found) {
        alert("Item not found");
        return;
    }

    var numToAdd = addItem(result);

    if (numToAdd) {
        // render updated row
        $("#u"+ result.upc +"").html(returnItemLine(result, numToAdd));
    } else {
        // render new row
        $('#myTable tr:last').after(returnItemLine(result, 0));
    }

    var sum = getSum();
    $('#total').html("Discount -$"+ sum[0] +" &emsp; Tax $"+sum[1]+" &emsp; <b>Total $"+sum[2]+"</b>");
}

function returnItemLine (data, numToAdd) {
    if (numToAdd) {
        return("<td>"+data.upc+"</td><td>"+data.name+"</td><td>"+numToAdd+"</td><td>"+data.price+"</td><td>"
            +(data.price * numToAdd).toFixed(2)+"</td>"+rowDelete);
    } else {
        return("<tr id='u"+data.upc+"'><td>"+data.upc+"</td><td>"+data.name+"</td><td>1</td><td>"+data.price+"</td><td>"
            +data.price+"</td>"+rowDelete+"</tr>");
    }
}

function addItem (data) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].upc == data.upc) {
            // update item
            alert("adding to existing");
            items[i].quantity++;
            return items[i].quantity;
        }
    }
    // add item
    alert("adding new");
    items.push({
        upc: data.upc,
        name: data.name,
        quantity: 1,
        price: data.price
    });
    return 0;
}
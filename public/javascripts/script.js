var items = [];
var discount = 0;
var tax = 13; // default 13%

const rowDelete = "<td class='text-right'><button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button></td>";

/** Adding item **/
$('#addItem').click(function(){
    var upc = $('#item').val();
    $('#item').val('');

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

/** Removing an item **/
$('#myTable').on('click', 'button.close', function(e){
    e.preventDefault();
    var nRow = $(this).parents('tr')[0];
    var item = deleteItem($(nRow).attr('id'));
    if (item == -1) {
        alert("Could not find item with corresponding UPC. Please report to admin.");
    } else if (item == null) {
        console.log("remove from table");
        $(nRow).remove();
    } else {
        console.log("subtract from table");
        $(nRow).html(returnItemLine(item, item.quantity));
    }
    console.log(items);
    updateSum();
});

/** Applying tax rate **/
$('#applyTax').click(function(){
    var newTax = $('#tax').val();
    if (newTax != "") {
        tax = newTax;
    }
    $('#modalTaxRate').modal('hide');
    updateSum();
});

/** Applying discount rate **/
$('#applyDiscount').click(function(){
    var newDiscount = $('#discount').val();
    if (newDiscount != "") {
        discount = newDiscount;
    }
    $('#modalDiscount').modal('hide');
    updateSum();
});

/** ---------------- **/
/** HELPER FUNCTIONS **/
/** ---------------- **/

function deleteItem(id) {
    /**
     * Returns:
     * null after removing item from items
     * updated item dict after subtracting item quantity by 1
     * -1 for error (item not found)
     */
    var upc = parseInt(id.substring(1));
    for (var i = 0; i < items.length; i++) {
        if (items[i].upc == upc) {
            if (items[i].quantity == 1) {
                items.splice(i, 1);
                return(null);
            } else if (items[i].quantity > 1) {
                items[i].quantity--;
                return(items[i]);
            }
        }
    }
    return(-1);
}

function getSum() {
    /**
     * Returns [a, b, c]:
     * a = amount of discount
     * b = amount of tax
     * c = total checkout amount
     */
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

function updateSum() {
    /** Render sum to screen */
    var sum = getSum();
    $('#total').html("Discount -$"+ sum[0] +" &emsp; Tax $"+sum[1]+" &emsp; <b>Total $"+sum[2]+"</b>");
}

function onSuccess (result) {
    /** To execute synchronously upon AJAX POST request **/
    if (!result.found) {
        alert("Item not found");
        return;
    }
    var numToAdd = addItem(result);
    if (numToAdd) {
        $("#u"+ result.upc +"").html(returnItemLine(result, numToAdd));
    } else {
        $('#myTable tr:last').after(returnItemLine(result, 0));
    }
    updateSum();
}

function returnItemLine (data, numToAdd) {
    /** Return appropriate html string to update item */
    if (numToAdd) {
        return("<td>"+data.upc+"</td><td>"+data.name+"</td><td class='quantity'>"+numToAdd+"</td><td>"
            +data.price+"</td><td class='totalPrice'>"+(data.price * numToAdd).toFixed(2)+"</td>"+rowDelete);
    } else {
        return("<tr id='u"+data.upc+"'><td>"+data.upc+"</td><td>"+data.name+"</td><td class='quantity'>1</td><td>"
            +data.price+"</td><td class='totalPrice'>"+data.price+"</td>"+rowDelete+"</tr>");
    }
}

function addItem (data) {
    /**
     * Returns:
     * 0 to add new item to items
     * >=1 to update existing item in items
     */
    for (var i = 0; i < items.length; i++) {
        if (items[i].upc == data.upc) {
            // update item
            console.log("adding to existing");
            items[i].quantity++;
            return items[i].quantity;
        }
    }
    // add item
    console.log("adding new");
    items.push({
        upc: data.upc,
        name: data.name,
        quantity: 1,
        price: data.price
    });
    return 0;
}
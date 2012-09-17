define([], function () {
    var baseUrl = "http://toodeloo.dolittle.com/ToDoItem/";
    return {
        getAll: function () {
            var items = ko.observableArray();
            $.getJSON(baseUrl+"GetAll", function (e) {
                items(e);
            });
            return items;
        },
        addItem: function (title) {
            var itemObj = { title: title };
            $.ajax({
                url: baseUrl+"Add",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(itemObj),
                contentType: "application/json; charset=utf-8"
            });
        },
        deleteItem: function (itemId) {
            var itemObj = { id: itemId };
            $.ajax({
                url: baseUrl+"Remove",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(itemObj),
                contentType: "application/json; charset=utf-8"
            });
        }
    }
});
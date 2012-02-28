$(function () {
    var todoInput = $(".labelInput input"),
        todoList = $("ul.todo-list"),
        saveButton = $(".sidebar li.save");


    todoInput.keypress(function (e) {

        if (e.which != 13) return;
        addTaskItem();
    });

    saveButton.click(function () {
        if (todoInput.val().length)
            addTaskItem();
    });

    todoList.delegate("a.delete-task", "click", function () {
        var task = $(this).parent("li");
        task.fadeOut("fast").remove();
    });

    function addTaskItem() {
        var listItem = createListItem(todoInput.val());
        todoList.append(listItem.fadeIn());
        todoInput.val("");
    }


    function createListItem(task) {
        var deleteTask = $("<a/>").addClass("delete-task")
                                  .append(
                                    $("<img/>").attr("src", "/Content/images/delete.png")
                                  );
        return $("<li/>").text(task).append(deleteTask);
    }


});


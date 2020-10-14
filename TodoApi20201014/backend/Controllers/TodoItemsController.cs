using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TodoApi20201014.Models;
using System.Linq;


namespace TodoApi20201014.Controllers
{
    [Route("api/[controller]")]
    public class TodoItemsController : ControllerBase
    {
        public readonly TodoContext _context;
        public TodoItemsController(TodoContext context)
        {
            _context = context;
        }

        // GET : api/TodoItems
        [HttpGet]
        public List<TodoItem> GetTodoItems()
        {
            return _context.TodoItems.ToList();
        }

        [HttpPost]
        public ActionResult<TodoItem> PostTodoItem([FromBody] TodoItem todoItem)
        {
            System.Diagnostics.Debug.WriteLine(todoItem);

            _context.Add(todoItem);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetTodoItems), new { id = todoItem.Id }, todoItem);
        }

        // GET: api/TodoItems/Greeting
        [Route("[action]")]
        public string Greeting()
        {
            return "hello";
        }
    }
}
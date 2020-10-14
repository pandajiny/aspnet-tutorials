using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TodoApi20201014.Models;
using System.Linq;
using Microsoft.AspNetCore.Cors;



namespace TodoApi20201014.Controllers
{
    [EnableCors("PolicyCors")]
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

            System.Diagnostics.Debug.WriteLine("api/TodoItems/ as called");
            System.Diagnostics.Debug.WriteLine(todoItem.Content);

            _context.Add(todoItem);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetTodoItems), new { id = todoItem.Id }, todoItem);
        }

        [HttpDelete("{id}")]
        public ActionResult<TodoItem> DeleteTodoItem(long Id)
        {
            var todoItem = _context.TodoItems.Find(Id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _context.Remove(todoItem);
            _context.SaveChanges();
            return todoItem;
        }

        [HttpPut]
        public ActionResult<TodoItem> UpdateTodoItem([FromBody] TodoItem todoItem)
        {
            if (TodoItemExists(todoItem.Id))
            {
                _context.TodoItems.Update(todoItem);
                _context.SaveChanges();
                return NoContent();
            }
            else
            {
                return NotFound();
            }

        }


        // GET: api/TodoItems/Greeting
        [Route("[action]")]
        public string Greeting()
        {
            System.Diagnostics.Debug.WriteLine("api/TodoItems/Greeting as called");

            return "hello";
        }

        private bool TodoItemExists(long id) =>
            _context.TodoItems.Any(e => e.Id == id);
    }
}
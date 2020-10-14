using Microsoft.EntityFrameworkCore;

namespace RazorPagesMovie.Data
{
    public class RazorPagesMovieContext : DbContext
    {
        public RazorPagesMovieContext(
            DbContextOptions<RazorPagesMovieContext> opitons
        ) : base(opitons)
        {
        }
        public DbSet<RazorPagesMovie.Models.Movie> Movie { get; set; }
    }
}
using System.Reflection;
using Toodeloo.WinRT.Features.Content;

namespace Toodeloo.WinRT
{
    public class ViewModelLocator
    {
        public ViewModelLocator()
        {
        }

        public void Initialize()
        {
            foreach (var property in this.GetType().GetTypeInfo().DeclaredProperties)
                property.SetValue(this, App.Container.Get(property.PropertyType));
        }

        public IndexViewModel Index { get; set; }
        public SidebarViewModel Sidebar { get; set; }
        public ListViewModel List { get; set; }
    }
}
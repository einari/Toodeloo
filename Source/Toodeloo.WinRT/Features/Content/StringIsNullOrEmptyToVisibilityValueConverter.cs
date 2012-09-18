using System;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Data;

namespace Toodeloo.WinRT.Features.Content
{
    public class StringIsNullOrEmptyToVisibilityValueConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            var reverse = false;
            if (null != parameter)
                reverse = bool.TryParse(parameter.ToString(), out reverse);
            var result = (value == null || string.IsNullOrEmpty(value.ToString()))^reverse;
            return result?Visibility.Collapsed:Visibility.Visible;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}

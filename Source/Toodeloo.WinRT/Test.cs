using System;

namespace Toodeloo.WinRT
{
    public class Test
    {
        string _firstName;
        string _lastName;

        public string FirstName 
        {
            get { return _firstName; }
            set
            {
                if (string.IsNullOrEmpty(value))
                    throw new ArgumentException();

                _firstName = value;
            }
        }

        public string LastName
        {
            get { return _lastName; }
            set
            {
                if (string.IsNullOrEmpty(value))
                    throw new ArgumentException();

                _lastName = value;
            }
        }

    }
}

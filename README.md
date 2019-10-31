# Price To String Converter 1000

This is a simple application to allow a user to enter a numeric price number in dollars and convert it to its string counterpart. For example:

`123.78` -> 'One hundred twenty three and 78/100 dollars'\
`4,938.42` -> 'Four thousand nine hundred thirty eight and 42/100 dollars'\
`2,392,372,565.00` -> 'Two billion three hundred ninety two million three hundred seventy two thousand five hundred sixty five and 0/100 dollars'

## Running the Application
This app is an Angular project. Assuming you have installed the Angular CLI on your machine, the app dependencies can be installed with `npm install`, and can then be run locally using `ng serve`. Navigate to `http://localhost:4200/` to view and use the application.

## Notes
Future improvements include:
 - Displaying the history of converted numbers for the user's current session.
 - Add unit test coverage (Decided to forego this in initial implementation for speed's sake).
 - Handle hyphens that should appear in numbers like 'seventy-five' and 'forty-one'.
 - Improve responsiveness and styling in general.

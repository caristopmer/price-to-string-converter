import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  priceForm: FormGroup;
  showError: boolean;
  cents = 0;

  result: string =  null;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  // input validation
  // - should be only numbers, commas, and one decimal point
  // display any errors

  // break off the cents and store in the component
  // strip out any commas
  // break the price into an array of groups of 3, starting from the end
  // need a function to evaluate up to a 3 digit number into text
  // (maybe have another for 2 digit that could be used by the 3 digit one as well)
  // depending one how many groups there are, append thousand or hundred to each group string

  ngOnInit() {
    this.priceForm = this.formBuilder.group({ price: [null, Validators.required] });
  }

  priceSubmitted() {
    const priceInput = this.priceForm.controls.price.value;
    this.showError = !this.validSubmission(priceInput);
    if (!this.showError) {
      // Remove any user-entered commas first.
      // console.log(this.buildTextString(priceInput.replace(/,/g, '')));
      this.result = this.buildTextString(priceInput.replace(/,/g, ''));
    }
  }

  validSubmission(price: string): boolean {
    // Check to make sure input consists of only valid characters
    const validCharacters = '0123456789,.';
    for (const char of price.split('')) {
      if (!validCharacters.includes(char)) {
        return false;
      }
    }

    // Check that there is only one decimal point included, and at most 2 digits of cents.
    const dollarsAndCentsArray = price.split('.');
    if (dollarsAndCentsArray.length > 2) {
      return false;
    } else if (dollarsAndCentsArray.length === 2) {
      if (dollarsAndCentsArray[1].length > 2) {
        return false;
      }
    }

    return true;
  }

  buildTextString(price: string): string {
    const dollars = price.split('.')[0];
    const cents = price.split('.')[1];
    this.cents = cents ? parseInt(cents, 10) : 0;
    console.log(this.cents);




    let insertions = 0;
    const reversedPrice = dollars.split('').reverse();

    for (let i = 1; i <= reversedPrice.length; i++) {
      if (
        i / 3 >= 1 &&
        i % 3 === 0 &&
        i + insertions < reversedPrice.length
      ) {
        reversedPrice.splice(i + insertions, 0, ',');
        insertions++;
      }
    }

    return reversedPrice.reverse().join('');
  }
}


// account for error stating only 2 cent numbers
// styling
// display history

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
  cents: number;

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
      const commaGroups = this.formatCommaGroups(priceInput.replace(/,/g, ''));
      this.result = this.buildFullString(commaGroups);
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

  // currently just breaking down the input and formatting the dollars into accurate comma groups
  // still need to orchestrate counting the number of comma groups and adding the correct number text
  // after the groups
  formatCommaGroups(price: string): string[] {
    const dollars = price.split('.')[0];
    const cents = price.split('.')[1];
    this.cents = cents ? parseInt(cents, 10) : 0;

    // Insert commas in the correct places in order to later split the number into comma groups
    // Reversed to group into 3's starting from the end of the number.
    let insertions = 0;
    const reversedPrice = dollars.split('').reverse();
    for (let i = 1; i <= reversedPrice.length; i++) {
      if (
        // every third place
        i / 3 >= 1 &&
        // no remainder
        i % 3 === 0 &&
        // not at the end of the string
        i + insertions < reversedPrice.length
      ) {
        reversedPrice.splice(i + insertions, 0, ',');
        insertions++;
      }
    }
    // Reverse the array back again, join, and split on the new commas
    return reversedPrice.reverse().join('').split(',');
  }

  convertOnesPlace(digit: number): string {
    const onesMapping = {
      0: '',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
      9: 'nine'
    };
    return onesMapping[digit];
  }

  convertTensPlace(digit: number): string {
    const tensMapping = {
      0: '',
      2: 'twenty',
      3: 'thirty',
      4: 'forty',
      5: 'fifty',
      6: 'sixty',
      7: 'seventy',
      8: 'eighty',
      9: 'ninety'
    };
    return tensMapping[digit];
  }

  convertTeenNumbers(digits: number): string {
    const teensMapping = {
      10: 'ten',
      11: 'eleven',
      12: 'twelve',
      13: 'thirteen',
      14: 'fourteen',
      15: 'fifteen',
      16: 'sixteen',
      17: 'seventeen',
      18: 'eighteen',
      19: 'nineteen',
    };
    return teensMapping[digits];
  }

  convertHundredsPlace(digit: number): string {
    return this.convertOnesPlace(digit) + ' hundred';
  }

  buildFullString(commaGroups: string[]): string {
    // takes in the commagroups array
    // iterate through and call another function to build the string piece for the comma group
    // add whatever (million, thousand, etc.) to the end of the number group based on position in array

    const finalString: string[] = [];
    for (let i = 0; i < commaGroups.length; i++) {
      finalString.push(this.buildCommaGroupString(commaGroups[i], (commaGroups.length - 1 - i)));
    }

    finalString.push(this.appendCentsString());

    finalString[0] = finalString[0].charAt(0).toUpperCase() + finalString[0].slice(1);
    return finalString.join(' ');
  }

  buildCommaGroupString(commaGroup: string, remainingGroups: number): string {
    // remaining groups is length-1 less current index
    const groupValues = {
      0: '',
      1: 'thousand',
      2: 'million',
      3: 'billion',
      4: 'trillion',
      5: 'quadrillion',
      6: 'quintillion',
      7: 'sextillion',
      8: 'septillion',
      9: 'octillion',
      10: 'nonillion'
    };

    const groupString: string[] = [];
    // flag to denote that a number 10-19 was present, and to skip the ones place conversion
    let teenNumberUsed = false;

    for (let i = 0; i < commaGroup.length; i++) {
      switch (commaGroup.length) {
        // The comma group has all 3 digits
        case 3:
          switch (i) {
            case 0:
              groupString.push(this.convertHundredsPlace(parseInt(commaGroup[i], 10)));
              break;
            case 1:
              if (commaGroup[i] === '1') {
                groupString.push(this.convertTeenNumbers(parseInt(commaGroup[i] + commaGroup[i + 1], 10)));
                teenNumberUsed = true;
              } else {
                groupString.push(this.convertTensPlace(parseInt(commaGroup[i], 10)));
              }
              break;
            case 2:
              if (!teenNumberUsed) {
                groupString.push(this.convertOnesPlace(parseInt(commaGroup[i], 10)));
              }
              break;
          }
          break;
        // The comma group is only 2 digits
        case 2:
          switch (i) {
            case 0:
              if (commaGroup[i] === '1') {
                groupString.push(this.convertTeenNumbers(parseInt(commaGroup[i] + commaGroup[i + 1], 10)));
                teenNumberUsed = true;
              } else {
                groupString.push(this.convertTensPlace(parseInt(commaGroup[i], 10)));
              }
              break;
            case 1:
              if (!teenNumberUsed) {
                groupString.push(this.convertOnesPlace(parseInt(commaGroup[i], 10)));
              }
              break;
          }
          break;
        // The comma group is only one digit
        case 1:
          groupString.push(this.convertOnesPlace(parseInt(commaGroup[i], 10)));
          break;
      }
    }

    groupString.push(groupValues[remainingGroups]);
    return groupString.join(' ');
  }

  appendCentsString() {
    return `and ${this.cents}/100 dollars`;
  }
}

// styling
// display history
// more robust to add hyphens where needed
// support larger numbers

export const industries = [
    { industry: "automation" },
    { industry: "vehicle" },
    { industry: "sales" },
];

export const dateFormats = [
    { value: "mm/dd/yyyy", label: "MM/DD/YYYY", example: "[03/13/2022]" },
    { value: "dd/mm/yyyy", label: "DD/MM/YYYY", example: "[13/03/2022]" },
    { value: "yyyy-mm-dd", label: "YYYY-MM-DD", example: "[2022-03-13]" },
    { value: "dd-mmm-yyyy", label: "DD-MMM-YYYY", example: "[13-Mar-2022]" },
    { value: "month d, yyyy", label: "Month D, YYYY",example: "[March 13, 2022]"},
];

export const financialYears = [
    { label: "January - December", value: "jan-dec" },
    { label: "February - January", value: "feb-jan" },
    { label: "March - February", value: "mar-feb" },
    { label: "April - March", value: "apr-mar" },
    { label: "May - April", value: "may-apr" },
    { label: "June - May", value: "jun-may" },
    { label: "July - June", value: "jul-jun" },
    { label: "August - July", value: "aug-jul" },
    { label: "September - August", value: "sep-aug" },
    { label: "October - September", value: "oct-sep" },
    { label: "November - October", value: "nov-oct" },
    { label: "December - November", value: "dec-nov" },
];

export const taxPreferences = [{ value: "Taxable" }, { value: "Non-Taxable" }];

export const paymentTermses = [
    { value: "Due on receipt" },
    { value: "Due end of the month" },
    { value: "Due next Month" },
];

export const stockStatus = [{ value: "In Stock" }, { value: "Out Of Stock" }];

export  const journalEntryStatus = [
    {
        value: "Published",
    },
    {
        value: "Draft",
    },
];



export const chartOfAccountData = [
    {
      _id: 1,
      bankName: "Other Charges",
      description: "Miscellaneous charges like adjustments made to the invoice can be recorded in this account.",
      accountType: "Income",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      __id: 2,
      bankName: "Lodging",
      description: "Any expense related to putting up at motels etc while on business travel can be entered here.",
      accountType: "Expense",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 3,
      bankName: "Undeposited Funds",
      description: "Record funds received by your company yet to be deposited in a bank as undeposited funds and group them as a current asset in your balance sheet.",
      accountType: "Cash",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 4,
      bankName: "Petty Cash",
      description: "It is a small amount of cash that is used to pay your minor or casual expenses rather than writing a check.",
      accountType: "Cash",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 5,
      bankName: "Accounts Receivable",
      description: "The money that customers owe you becomes the accounts receivable. A good example of this is a payment expected from an invoice sent to your customer.",
      accountType: "Accounts Receivable",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 6,
      bankName: "Furniture and Equipment",
      description: "Purchases of furniture and equipment for your office that can be used for a long period of time usually exceeding one year can be tracked with this account.",
      accountType: "Fixed Asset",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 7,
      bankName: "Advance Tax",
      description: "Any tax which is pa_id in advance is recorded into the advance tax account. This advance tax payment could be a quarterly, half yearly or yearly payment.",
      accountType: "Other Current Asset",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 8,
      bankName: "Accounts Payable",
      description: "This is an account of all the money which you owe to others like a pending bill payment to a vendor, etc.",
      accountType: "Accounts Payable",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 9,
      bankName: "Tax Payable",
      description: "The amount of money which you owe to your tax authority is recorded under the tax payable account. This amount is a sum of your outstanding in taxes and the tax charged on sales.",
      accountType: "Other Current Liability",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    },
    {
      _id: 10,
      bankName: "Retained Earnings",
      description: "The earnings of your company which are not distributed among the shareholders is accounted as retained earnings.",
      accountType: "Equity",
      accountNumber: 0,
      isMileage: false,
      currency: "INR"
    }
]
  

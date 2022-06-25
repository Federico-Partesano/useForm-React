# form-simple-react

Simple form in React.

## Installation
```bash
yarn add form-simple-react
```

##  Usage
### Example
```typescript
import Form, { FormType, ISetForm, IValidators } from "form-simple-react/dist/Form/Form";
import { FC } from "react";
import "./App.css";
function App() {
  const initialValueForm = {
    text: "",
    customText: "",
    emailInput: "",
    checkbox: false,
    textArea: { nestedInput: "" },
  };
  const handleSubmit = (form: FormType<typeof initialValueForm>) => {
    console.log("submit");
  };

  const validators: IValidators<typeof initialValueForm> = {
    text: { required: "required field" },
    emailInput: { invalidEmail: "invalid format email" },
    // you can use the custom function for custom validations, the argument is the field value
    checkbox: { custom: (value) => !value ? "value is must true" : "" },
  };

  const CustomInput: FC<{setForm: ISetForm<typeof initialValueForm>, value: any}> = ({setForm, value}) => {
    return <input onChange={({target: {value}}) => setForm("text", value )} value={value}></input>
  }

  return (
    <form className="App">
      <div style={{ display: "inline-flex", flexDirection: "column" }}>
      {/* // yYu can use autoScrollOnError to automatically scroll to an error in a form field */}
        <Form initialValue={initialValueForm} validators={validators} autoScrollOnError={true}>
          {({ Field, TextArea, setForm, form, Error, submit, errors, Label }) => {            
            return (
              <>
              <div>
                <Label htmlFor="checkbox">Label for checkbox</Label>
                <Field type="checkbox" name="checkbox" />
                <Error name="checkbox" />
                </div>
                <div>
                  <Field name="text" className="..." style={{color: "red"}} placeholder="text field" />
                  {/* you can also use a custom component */}
                  <CustomInput setForm={setForm} value={form.text}></CustomInput>
                  <Error name="text" />
                  <Field name="emailInput" type={"text"} placeholder="email field"
                  ></Field>
                  <Error name="emailInput" />
                </div>
                <TextArea name="textArea/nestedInput" placeholder="text-area" />
                {/* Manually access a form value */}
                <h1>Value email form: {form.emailInput}</h1>
                {/* Manually access a error field */}
                <h1>Error email form: {errors.emailInput}</h1>
                {/* You can manually change a form field with the setForm function */}
                <div onClick={() => setForm("checkbox", !form.checkbox)}>
                  change value checkbox
                </div>
                {/* invoke the function handle submit only if there are no errors in the form */}
                <div onClick={() => submit((form) => handleSubmit(form))}>
                  submit
                </div>
              </>
            );
          }}
        </Form>
      </div>
    </form>
  );
}

export default App;


```

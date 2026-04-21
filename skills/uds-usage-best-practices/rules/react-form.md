# Form

## Import

```jsx
import Form, { FormField } from '@ionos-web-design-system/react/form';
```

## Props

### Form

| Prop                  | Type                                   | Default    | Description                                               |
| --------------------- | -------------------------------------- | ---------- | --------------------------------------------------------- |
| `onSubmit`            | `(e: React.FormEvent) => void`         | —          | Form submission handler                                   |
| `submit`              | `React.ReactNode`                      | —          | String → default Button; ReactNode → custom submit button |
| `reset`               | `React.ReactNode`                      | —          | String → reset Button; ReactNode → custom reset button    |
| `labelPosition`       | `'inside' \| 'top' \| 'left'`         | `'inside'` | Default label position for all child fields               |
| `labelWidth`          | `string`                               | `'100px'`  | Label column width when labelPosition="left"              |
| `onClearServerErrors` | `() => void`                           | —          | Callback to clear server errors on submit                 |
| `className`           | `string`                               | —          | Additional CSS classes                                    |
| `children`            | `React.ReactNode`                      | —          | **Required.** Form content                                |
| `testId`              | `string`                               | —          | Test identifier                                           |

Extends `React.FormHTMLAttributes<HTMLFormElement>` (excluding `onSubmit`).

### FormField

| Prop                      | Type                                             | Default | Description                              |
| ------------------------- | ------------------------------------------------ | ------- | ---------------------------------------- |
| `name`                    | `string`                                         | —       | **Required.** Field name for validation  |
| `serverInvalid`           | `boolean`                                        | —       | Show server error state                  |
| `valueMissingMessage`     | `string`                                         | —       | Message for required validation          |
| `typeMismatchMessage`     | `string`                                         | —       | Message for type validation (email, url) |
| `patternMismatchMessage`  | `string`                                         | —       | Message for pattern validation           |
| `tooShortMessage`         | `string`                                         | —       | Message for minLength validation         |
| `tooLongMessage`          | `string`                                         | —       | Message for maxLength validation         |
| `rangeUnderflowMessage`   | `string`                                         | —       | Message for min range validation         |
| `rangeOverflowMessage`    | `string`                                         | —       | Message for max range validation         |
| `customValidation`        | `(value: string, formData: FormData) => boolean` | —       | Custom validation function               |
| `customValidationMessage` | `string`                                         | —       | Message for custom validation            |
| `serverErrorMessage`      | `string`                                         | —       | Message shown when serverInvalid=true    |
| `className`               | `string`                                         | —       | Additional CSS classes                   |
| `children`                | `React.ReactNode`                                | —       | **Required.** Input element              |

## Usage

```jsx
<Form
  onSubmit={(e) => {
    e.preventDefault();
    alert('Submitted!');
  }}
  submit="Register"
  reset="Clear"
>
  <FormField name="name" valueMissingMessage="Name is required.">
    <InputField label="Full Name" required />
  </FormField>
  <FormField
    name="email"
    valueMissingMessage="Email is required."
    typeMismatchMessage="Please enter a valid email."
  >
    <InputField label="Email" type="email" required clearable />
  </FormField>
</Form>
```

### Label position context

Set `labelPosition` on Form to apply to all child inputs.

```jsx
<Form labelPosition="left" labelWidth="120px" submit="Save">
  <FormField name="firstName">
    <InputField label="First Name" />
  </FormField>
  <FormField name="lastName">
    <InputField label="Last Name" />
  </FormField>
</Form>
```

### Client validation

FormField provides constraint validation messages mapped to native HTML
validity states.

```jsx
<Form submit="Submit">
  <FormField
    name="email"
    valueMissingMessage="Email is required."
    typeMismatchMessage="Please enter a valid email."
  >
    <InputField label="Email" type="email" required />
  </FormField>
  <FormField
    name="password"
    valueMissingMessage="Password is required."
    tooShortMessage="Minimum 8 characters."
  >
    <InputField label="Password" type="password" required minLength={8} />
  </FormField>
</Form>
```

### Server errors

Use `serverInvalid` and `serverErrorMessage` on FormField, and
`onClearServerErrors` on Form to clear them on re-submit.

```jsx
<Form onSubmit={handleSubmit} onClearServerErrors={() => setErrors(null)} submit="Login">
  <FormField
    name="email"
    serverInvalid={!!errors?.email}
    serverErrorMessage={errors?.email}
  >
    <InputField label="Email" type="email" />
  </FormField>
</Form>
```

### Custom submit and reset buttons

Pass a ReactNode instead of a string for full control over button styling.

```jsx
<Form
  submit={
    <Button concept="brand" variant="primary">
      <Button.Text>Create Account</Button.Text>
    </Button>
  }
  reset={
    <Button concept="monochrome" variant="tertiary" type="reset">
      <Button.Text>Discard</Button.Text>
    </Button>
  }
>
  {/* fields */}
</Form>
```

## Do

- Wrap every input inside a `FormField` with a unique `name` for validation to
  work.
- Use `labelPosition` on Form to set a consistent layout — individual inputs can
  still override.
- Provide constraint messages (`valueMissingMessage`, `typeMismatchMessage`,
  etc.) for user-friendly error text.
- Call `e.preventDefault()` in `onSubmit` to prevent native form submission.

## Don't

- Omit `name` on FormField — Radix Form requires it for field tracking.
- Place inputs directly in Form without FormField — validation will not apply.
- Use both `serverInvalid` and client validation messages for the same condition
  — pick one source of truth.
- Forget `type="reset"` on custom reset button ReactNodes — the string shorthand
  adds it automatically, but custom elements must include it.

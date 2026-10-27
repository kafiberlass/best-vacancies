import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, Centered, ErrorMessage, Field, FieldLabel, Input, Panel } from './ui';

const Form = styled(Panel).attrs({ as: 'form' })`
  width: min(420px, 100%);
`;

const Logo = styled.p`
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  margin: 0 0 22px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

const Links = styled.p`
  margin: 4px 0 20px;
  font-size: 14px;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// Общая форма для входа и регистрации. fields: [{ name, label, type, autoComplete }]
function AuthForm({ title, fields, submitText, onSubmit, links }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Centered>
      <Form onSubmit={handleSubmit} noValidate>
        <Logo>BestVacancies</Logo>
        <Title>{title}</Title>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        {fields.map(({ name, label, type = 'text', autoComplete }) => (
          <Field key={name}>
            <FieldLabel>{label}</FieldLabel>
            <Input name={name} type={type} value={values[name]} onChange={handleChange} autoComplete={autoComplete} required />
          </Field>
        ))}

        <Links>
          {links.map(({ text, to, label }, index) => (
            <span key={to}>
              {index > 0 && <br />}
              {text} <Link to={to}>{label}</Link>
            </span>
          ))}
        </Links>

        <Actions>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Подождите…' : submitText}
          </Button>
        </Actions>
      </Form>
    </Centered>
  );
}

export default AuthForm;

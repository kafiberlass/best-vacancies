// Общие стилизованные компоненты интерфейса
import styled, { css } from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 22px;
  font: inherit;
  font-weight: 600;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  ${({ theme, $variant = 'primary' }) => {
    const { colors } = theme;
    const variants = {
      primary: css`
        color: #fff;
        background: ${colors.primary};
        &:hover:not(:disabled) {
          background: ${colors.primaryDark};
        }
      `,
      outline: css`
        color: ${colors.primary};
        background: ${colors.surface};
        border-color: ${colors.primary};
        &:hover:not(:disabled) {
          background: ${colors.primarySoft};
        }
      `,
      success: css`
        color: ${colors.success};
        background: ${colors.surface};
        border-color: ${colors.success};
        &:hover:not(:disabled) {
          background: ${colors.successSoft};
        }
      `,
      danger: css`
        color: ${colors.danger};
        background: ${colors.surface};
        border-color: ${colors.danger};
        &:hover:not(:disabled) {
          background: ${colors.dangerSoft};
        }
      `,
    };
    return variants[$variant];
  }}
`;

const fieldStyles = css`
  width: 100%;
  padding: 10px 12px;
  font: inherit;
  color: inherit;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Textarea = styled.textarea`
  ${fieldStyles}
  min-height: 140px;
  resize: vertical;
`;

export const Select = styled.select`
  ${fieldStyles}
  cursor: pointer;
`;

export const Field = styled.label`
  display: block;
  margin-bottom: 18px;
`;

export const FieldLabel = styled.span`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Chip = styled.span`
  display: inline-block;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
`;

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ErrorMessage = styled.p`
  margin: 0 0 16px;
  padding: 10px 14px;
  color: #a12828;
  background: ${({ theme }) => theme.colors.dangerSoft};
  border-radius: 10px;
`;

export const Muted = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Panel = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const PageTitle = styled.h1`
  margin: 0 0 20px;
  font-size: 26px;
`;

export const Centered = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px 16px;
`;

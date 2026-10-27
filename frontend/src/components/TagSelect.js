import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`;

const Toggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  min-height: 46px;
  padding: 6px 12px;
  font: inherit;
  text-align: left;
  color: inherit;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme, $open }) => ($open ? theme.colors.primary : theme.colors.border)};
  border-radius: 10px;
  cursor: pointer;
`;

const Selected = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  padding: 2px 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: 6px;
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const Arrow = styled.span`
  flex-shrink: 0;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0')});
  transition: transform 0.2s;
`;

const Menu = styled.ul`
  position: absolute;
  z-index: 10;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 260px;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  list-style: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

// Выпадающий список с множественным выбором тегов
function TagSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Закрываем список по клику вне него и по Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleClick = (event) => {
      if (!wrapperRef.current.contains(event.target)) setIsOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const toggleTag = (tag) => {
    onChange(value.includes(tag) ? value.filter((item) => item !== tag) : [...value, tag]);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Toggle type="button" $open={isOpen} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
        {value.length > 0 ? (
          <Selected>
            {value.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Selected>
        ) : (
          <Placeholder>Выберите теги</Placeholder>
        )}
        <Arrow $open={isOpen} aria-hidden="true">
          ▾
        </Arrow>
      </Toggle>

      {isOpen && (
        <Menu role="listbox" aria-multiselectable="true">
          {options.map((tag) => (
            <li key={tag}>
              <Option>
                <input type="checkbox" checked={value.includes(tag)} onChange={() => toggleTag(tag)} />
                {tag}
              </Option>
            </li>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

export default TagSelect;

import { memo } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { PeopleIcon } from './icons';

const Card = styled(NavLink)`
  position: relative;
  display: block;
  padding: 18px 20px;
  color: inherit;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow};
  }

  &.active {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 18px;
`;

const Company = styled.p`
  margin: 0 0 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Badge = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ theme, $tone }) => ($tone === 'success' ? theme.colors.success : $tone === 'muted' ? theme.colors.muted : theme.colors.text)};
`;

function VacancyCard({ vacancy, to }) {
  return (
    <Card to={to}>
      <Header>
        <Title>{vacancy.title}</Title>
        {vacancy.responded && <Badge $tone="success">✓ Вы откликнулись</Badge>}
        {vacancy.responsesCount !== undefined && (
          <Badge title="Откликов на вакансию">
            <PeopleIcon />
            {vacancy.responsesCount}
          </Badge>
        )}
      </Header>
      <Company>
        {vacancy.company}
        {!vacancy.isActive && ' · закрыта'}
      </Company>
      <Description>{vacancy.shortDescription}</Description>
    </Card>
  );
}

export default memo(VacancyCard);

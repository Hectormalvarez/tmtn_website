import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContributionHeatmap } from '@/components/contribution-heatmap';
import { mockCommitActivity } from '../test/fixtures';

describe('ContributionHeatmap', () => {
  it('renders week columns with 7 day cells each', () => {
    const { container } = render(<ContributionHeatmap data={mockCommitActivity} />);
    const cells = container.querySelectorAll('.rounded-sm');
    expect(cells.length).toBe(mockCommitActivity.length * 7);
  });

  it('renders day labels', () => {
    render(<ContributionHeatmap data={mockCommitActivity} />);
    expect(screen.getByText('Mon')).toBeDefined();
    expect(screen.getByText('Wed')).toBeDefined();
    expect(screen.getByText('Fri')).toBeDefined();
  });

  it('renders month labels', () => {
    render(<ContributionHeatmap data={mockCommitActivity} />);
    const monthLabels = screen.getAllByText(/[A-Z][a-z]{2}/);
    expect(monthLabels.length).toBeGreaterThan(0);
  });

  it('renders empty state when data is empty', () => {
    render(<ContributionHeatmap data={[]} />);
    expect(screen.getByText(/no activity data/i)).toBeDefined();
  });

  it('applies title attribute for native tooltips', () => {
    const { container } = render(<ContributionHeatmap data={mockCommitActivity} />);
    const cells = container.querySelectorAll('.rounded-sm');
    cells.forEach((cell) => {
      expect(cell.getAttribute('title')).toMatch(/\d+ commits? on [A-Z][a-z]+ \d+/);
    });
  });
});

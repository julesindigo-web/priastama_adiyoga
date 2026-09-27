import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Home from '@/pages/Home';

function scrollMock() {
  return window.HTMLElement.prototype.scrollIntoView as unknown as ReturnType<
    typeof vi.fn
  >;
}

describe('navigation interactions (integration)', () => {
  it('opens the mobile drawer and closes it via the toggle', async () => {
    const user = userEvent.setup();
    render(<Home />);
    const burger = screen.getByRole('button', { name: /buka menu navigasi/i });

    await user.click(burger);
    expect(
      screen.getByRole('dialog', { name: /menu navigasi hse/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /tutup menu navigasi/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tutup menu navigasi/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /menu navigasi hse/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('closes the mobile drawer on Escape', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole('button', { name: /buka menu navigasi/i }));
    expect(
      screen.getByRole('dialog', { name: /menu navigasi hse/i }),
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /menu navigasi hse/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('scrolls to a section when a drawer item is chosen', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole('button', { name: /buka menu navigasi/i }));
    const drawer = screen.getByRole('dialog', { name: /menu navigasi hse/i });
    await user.click(
      within(drawer).getByRole('button', { name: 'Experience' }),
    );
    expect(scrollMock()).toHaveBeenCalled();
  });

  it('exposes reachable contact channels with correct hrefs', () => {
    render(<Home />);
    const mails = screen.getAllByRole('link', {
      name: /kirim email kebutuhan hse/i,
    });
    expect(mails.length).toBeGreaterThanOrEqual(1);
    for (const link of mails) {
      expect(link).toHaveAttribute('href', expect.stringContaining('mailto:'));
    }
    expect(
      screen.getByRole('link', { name: /linkedin/i }),
    ).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(
      screen.getByRole('link', { name: /whatsapp/i }),
    ).toHaveAttribute('href', expect.stringContaining('wa.me'));
    expect(
      screen.getByRole('link', { name: /telepon hse/i }),
    ).toHaveAttribute('href', expect.stringContaining('tel:'));
  });

  it('stamps the footer with the current year', () => {
    render(<Home />);
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()}`)),
    ).toBeInTheDocument();
  });
});

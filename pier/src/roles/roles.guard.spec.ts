import { RolesGuard } from './userRoles.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    expect(new RolesGuard()).toBeDefined();
  });
});

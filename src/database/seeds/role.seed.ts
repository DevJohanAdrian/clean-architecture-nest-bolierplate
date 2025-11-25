import { DataSource } from 'typeorm';
import { Role } from '@modules/users/entities/roles.entity';
import { SYSTEM_ROLES } from '@src/common/constanst/users.const';

export default class RolesSeed {
  async run(ds: DataSource): Promise<void> {
    const repo = ds.getRepository(Role);

    const roles = Object.values(SYSTEM_ROLES);

    for (const role of roles) {
      const exists = await repo.findOne({ where: { code: role.code } });
      if (!exists) await repo.save(role);
    }
  }
}

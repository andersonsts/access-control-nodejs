import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateRolesUsers1596841918839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'role_id',
            type: 'uuid'
          },
          {
            name: 'user_id',
            type: 'uuid'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    )

    await queryRunner.createForeignKey(
      'roles_users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        name: 'fk_roles_users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    )

    await queryRunner.createForeignKey(
      'roles_users',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        name: 'fk_users_roles',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('roles_users', 'fk_users_roles');
    await queryRunner.dropForeignKey('roles_users', 'fk_roles_users');
    await queryRunner.dropTable('roles_users');
  }
}

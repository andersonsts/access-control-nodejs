import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddAvatarFieldToProducts1597071261141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('products', new TableColumn({
      name: 'image',
      type: 'varchar',
      isNullable: true,
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'image');
  }
}

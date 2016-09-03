<?php
use Migrations\AbstractMigration;

class CreateEmployers extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-change-method
     * @return void
     */
    public function change()
    {
        $table = $this->table('employers');
        $table->addColumn('name', 'string', [
            'default' => null,
            'limit' => 255,
            'null' => false,
        ]);
        $table->addColumn('salary', 'integer', [
            'default' => null,
            'limit' => 255,
            'null' => false,
        ]);
        $table->addColumn('bar_id', 'integer')->addForeignKey('bar_id', 'bars', 'id',[
            'delete' => 'NO_ACTION',
            'update' => 'NO_ACTION'
        ]);
        $table->create();
    }
}

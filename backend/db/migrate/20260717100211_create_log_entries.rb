class CreateLogEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :log_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.references :booking, null: true, foreign_key: true
      t.string :site_name
      t.date :date
      t.integer :depth
      t.integer :duration
      t.integer :water_temp
      t.integer :visibility
      t.text :highlights

      t.timestamps
    end
  end
end

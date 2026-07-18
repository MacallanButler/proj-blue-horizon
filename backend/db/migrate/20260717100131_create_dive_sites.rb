class CreateDiveSites < ActiveRecord::Migration[8.1]
  def change
    create_table :dive_sites, id: :string do |t|
      t.string :name
      t.string :location
      t.string :country
      t.integer :depth_min
      t.integer :depth_max
      t.integer :visibility_min
      t.integer :visibility_max
      t.integer :temperature_min
      t.integer :temperature_max
      t.string :difficulty
      t.float :rating
      t.integer :reviews
      t.text :description
      t.string :image_url
      t.float :lat
      t.float :lng
      t.text :marine_life
      t.text :best_months
      t.string :current_strength
      t.text :features

      t.timestamps
    end
  end
end

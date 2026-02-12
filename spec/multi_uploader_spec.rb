require './config.rb'
require './multi_uploader.rb'

RSpec.describe "multi_uploader.rb" do
  it "perform_uploads works" do

    # mock Config.openai client to return a files object with a create-edit method
    # the create-edit method should return the string "file_object1"

    # Create the mock objects
    mock_file_object = double(filename: "filename1", bytes: 1024)
    mock_files = double(create: mock_file_object)
    mock_openai = double(files: mock_files)

    # Stub Config.openai_client to return the mock
    allow(Config).to receive(:openai_client).and_return(mock_openai)

    multi_uploader = MultiUploader.new
    multi_uploader.files = ["filename1"]
    multi_uploader.perform_uploads
    expect(multi_uploader.file_objects.length).to eq(1)
  end
end

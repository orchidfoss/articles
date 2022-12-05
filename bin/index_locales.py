# Python code to search .mp3 files in current
# folder (We can change file type/name and path
# according to the requirements.
import os

# This is to get the directory that the program
# is currently running in.
dir_path = os.getcwd()

locales_index = open(dir_path + '/bin/locales_index.txt', 'w')
locales_index.close()

locales_index = open(dir_path + '/bin/locales_index.txt', 'a')

for root, dirs, files in os.walk(dir_path):
  for file in files:
    relative_path = root.replace(dir_path + '/', '') + '/' + str(file)

    # change the extension from '.mp3' to
    # the one of your choice.
    if file.endswith('en-US.properties'):
      print(relative_path)
      locales_index.write(relative_path + '\n')
      pass

locales_index.close()

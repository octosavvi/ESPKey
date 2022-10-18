Import("env")

# remove '--before no_reset' from uploader args
uploader_flags = env["UPLOADERFLAGS"]
if ('no_reset' in uploader_flags):
    idx=uploader_flags.index('no_reset')
    print(f'*** REMOVING {uploader_flags[idx-1:idx+1]} from uploader_flags')
    del uploader_flags[idx-1:idx+1]

# print("****************** ENVDUMP")
# print(env.Dump())

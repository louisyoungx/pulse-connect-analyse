from data import pulseData

i = 0
res = []
for item in pulseData:
    i += 1
    if i == 100:
        i = 0
        res.append(item)

print(res)
print(len(res))
